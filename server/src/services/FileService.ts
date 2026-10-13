import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as ftp from 'basic-ftp';
import { Readable } from 'stream';
import sharp from 'sharp';
import { config } from '../config/ftp';
import { LogService } from './LogService';

export interface StoredFile {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
}

export interface UploadInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

/** Raster formats we re-encode; SVG, GIF and video are stored untouched. */
const OPTIMISABLE = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/tiff',
]);
const MAX_DIMENSION = Number(process.env.MEDIA_MAX_DIMENSION || 2400);
const WEBP_QUALITY = Number(process.env.MEDIA_WEBP_QUALITY || 82);

const joinRemote = (...parts: string[]) =>
  ('/' + parts.join('/')).replace(/\/{2,}/g, '/');

/** A connection to wherever media files are stored. */
interface StorageSession {
  put(relPath: string, data: Buffer): Promise<void>;
  remove(relPath: string): Promise<void>;
  close(): void;
}

interface StorageBackend {
  publicUrl(): string;
  open(): Promise<StorageSession>;
}

/** Production: files go to the hosting server over FTP. */
const ftpBackend: StorageBackend = {
  publicUrl: () => config.FTP_PUBLIC_URL.replace(/\/$/, ''),
  async open() {
    const client = new ftp.Client(30_000);
    client.ftp.verbose = false;
    await client.access({
      host: config.FTP_HOST,
      user: config.FTP_USER,
      password: config.FTP_PASSWORD,
      port: Number(config.FTP_PORT),
      secure: process.env.FTP_SECURE === 'true',
    });
    const full = (rel: string) => joinRemote(config.FTP_BASE_PATH, rel);
    return {
      async put(rel, data) {
        await client.ensureDir(path.posix.dirname(full(rel)));
        await client.uploadFrom(Readable.from(data), full(rel));
      },
      async remove(rel) {
        await client.remove(full(rel));
      },
      close: () => client.close(),
    };
  },
};

/** Development: files are written to ./uploads and served by the API. */
export const LOCAL_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

const localBackend: StorageBackend = {
  publicUrl: () => {
    const origin = process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 8000}`;
    return `${origin.replace(/\/$/, '')}/uploads`;
  },
  async open() {
    const full = (rel: string) => path.join(LOCAL_UPLOAD_DIR, rel);
    return {
      async put(rel, data) {
        await fs.mkdir(path.dirname(full(rel)), { recursive: true });
        await fs.writeFile(full(rel), data);
      },
      remove: (rel) => fs.rm(full(rel), { force: true }),
      close: () => undefined,
    };
  },
};

/**
 * DPI to rasterise a photo-wrapping SVG at, so the output keeps the full
 * resolution of the largest embedded photo (capped at MAX_DIMENSION) rather
 * than the SVG's often much smaller nominal size. 72 DPI = 1 SVG px per px.
 */
async function svgRenderDensity(svg: Buffer) {
  const nominal = await sharp(svg, { unlimited: true }).metadata();
  const svgWidth = Math.max(nominal.width ?? 0, nominal.height ?? 0) || 1000;

  let embedded = 0;
  const re = /data:image\/[a-z+]+;base64,([A-Za-z0-9+/=\s]+)/g;
  const text = svg.toString('latin1');
  for (let m = re.exec(text); m; m = re.exec(text)) {
    try {
      const meta = await sharp(Buffer.from(m[1], 'base64')).metadata();
      embedded = Math.max(embedded, meta.width ?? 0, meta.height ?? 0);
    } catch {
      // unreadable embedded image — ignore it
    }
  }

  const target = Math.min(Math.max(embedded, svgWidth * 2), MAX_DIMENSION);
  return Math.max(72, Math.min((72 * target) / svgWidth, 2400));
}

export const isLocalStorage = () => process.env.STORAGE_DRIVER === 'local';
const backend = () => (isLocalStorage() ? localBackend : ftpBackend);

export class FileService {
  /** Resize + convert raster images to WebP; returns the bytes to store. */
  async prepare(input: UploadInput) {
    let { buffer, mimeType } = input;
    let ext = path.extname(input.originalName).toLowerCase() || '';
    let width: number | null = null;
    let height: number | null = null;

    // Design-tool exports often wrap a photo as base64 inside an SVG, which
    // is huge and slow to render. Rasterise those; keep true vector SVGs.
    const isWrappedRaster =
      mimeType === 'image/svg+xml' && buffer.includes('data:image/');

    if (OPTIMISABLE.has(mimeType) || isWrappedRaster) {
      const out = await sharp(buffer, {
        failOn: 'none',
        density: isWrappedRaster ? await svgRenderDensity(buffer) : undefined,
        // Embedded photos can exceed libxml's default 10MB node limit.
        // Uploads are admin-only, so lifting it here is acceptable.
        unlimited: isWrappedRaster,
      })
        .rotate()
        .resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer({ resolveWithObject: true });
      buffer = out.data;
      width = out.info.width;
      height = out.info.height;
      mimeType = 'image/webp';
      ext = '.webp';
    } else if (mimeType.startsWith('image/')) {
      try {
        const meta = await sharp(buffer).metadata();
        width = meta.width ?? null;
        height = meta.height ?? null;
      } catch {
        // Unreadable metadata is fine; dimensions are optional.
      }
    }

    return { buffer, mimeType, ext, width, height };
  }

  async saveFiles(files: UploadInput[], folder = 'general'): Promise<StoredFile[]> {
    const saved: StoredFile[] = [];
    const store = backend();
    let session = await store.open();
    const safeFolder = folder.replace(/[^a-z0-9-_]/gi, '') || 'general';

    // FTP servers drop long-lived or busy connections now and then; reconnect
    // and retry a failed transfer a few times before giving up.
    const putWithRetry = async (fileName: string, data: Buffer) => {
      for (let attempt = 1; ; attempt++) {
        try {
          return await session.put(fileName, data);
        } catch (err) {
          if (attempt >= 3) throw err;
          console.warn(`⚠️  Upload of ${fileName} failed (${(err as Error).message}), retrying…`);
          LogService.system('storage.retry', `Upload to storage failed, retrying (attempt ${attempt + 1} of 3)`, 'warning', {
            file: fileName,
            error: (err as Error).message,
          });
          session.close();
          await new Promise((r) => setTimeout(r, 1000 * attempt));
          session = await store.open();
        }
      }
    };

    try {
      for (const file of files) {
        const prepared = await this.prepare(file);
        const fileName = `${safeFolder}/${uuidv4()}${prepared.ext}`;
        await putWithRetry(fileName, prepared.buffer);

        saved.push({
          url: `${store.publicUrl()}/${fileName}`,
          fileName,
          mimeType: prepared.mimeType,
          size: prepared.buffer.length,
          width: prepared.width,
          height: prepared.height,
        });
      }
    } catch (error) {
      console.error('Error saving files:', error);
      LogService.system('storage.failed', 'Uploading to the storage server failed', 'error', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error('Error saving files to storage server');
    } finally {
      session.close();
    }
    return saved;
  }

  /** `fileName` is the storage-relative path returned by saveFiles. */
  async removeFiles(fileNames: string[]): Promise<void> {
    if (!fileNames.length) return;
    const session = await backend().open();
    try {
      for (const fileName of fileNames) {
        try {
          await session.remove(fileName);
        } catch (error) {
          console.warn(`Failed to remove file: ${fileName}`, error);
        }
      }
    } finally {
      session.close();
    }
  }
}
