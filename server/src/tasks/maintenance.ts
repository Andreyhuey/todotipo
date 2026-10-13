/**
 * Monthly maintenance:
 *  - deletes visit records older than VISIT_RETENTION_MONTHS (default 13) —
 *    they contain IP addresses, so don't keep them forever;
 *  - deletes cached IP lookups older than 60 days;
 *  - compares the storage folder with the media library and reports files
 *    that exist on only one side (nothing is deleted automatically).
 * Emails ALERT_EMAIL only when something needs attention.
 */
import * as ftp from 'basic-ftp';
import { LessThan } from 'typeorm';
import { AppDataSource } from '../config/database';
import { config as ftpConfig } from '../config/ftp';
import { Visit } from '../entity/Visit';
import { IpGeo } from '../entity/IpGeo';
import { Media } from '../entity/Media';
import { isLocalStorage } from '../services/FileService';
import { MailerService } from '../services/MailService';
import { LogService } from '../services/LogService';
import { adminLink, runTask, siteName } from './_shared';

const VISIT_RETENTION_MONTHS = Number(process.env.VISIT_RETENTION_MONTHS || 13);
const GEO_CACHE_MAX_DAYS = 60;

/** Every file under the storage base path, as "folder/name". */
async function listStorageFiles(): Promise<string[]> {
  const client = new ftp.Client(30_000);
  try {
    await client.access({
      host: ftpConfig.FTP_HOST,
      user: ftpConfig.FTP_USER,
      password: ftpConfig.FTP_PASSWORD,
      port: Number(ftpConfig.FTP_PORT),
      secure: process.env.FTP_SECURE === 'true',
    });
    const base = ('/' + ftpConfig.FTP_BASE_PATH).replace(/\/+/g, '/').replace(/\/$/, '');
    const files: string[] = [];
    for (const entry of await client.list(base || '/')) {
      if (!entry.isDirectory) continue;
      for (const f of await client.list(`${base}/${entry.name}`)) {
        if (f.isFile) files.push(`${entry.name}/${f.name}`);
      }
    }
    return files;
  } finally {
    client.close();
  }
}

runTask('maintenance', async () => {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - VISIT_RETENTION_MONTHS);

  const visits = await AppDataSource.getRepository(Visit).delete({ createdAt: LessThan(cutoff) });
  const geo = await AppDataSource.getRepository(IpGeo).delete({
    fetchedAt: LessThan(new Date(Date.now() - GEO_CACHE_MAX_DAYS * 864e5)),
  });

  let orphans: string[] = [];
  let missing: string[] = [];
  if (!isLocalStorage()) {
    const [onDisk, media] = await Promise.all([
      listStorageFiles(),
      AppDataSource.getRepository(Media).find({ select: ['fileName', 'originalName'] }),
    ]);
    const known = new Set(media.map((m) => m.fileName));
    const present = new Set(onDisk);
    orphans = onDisk.filter((f) => !known.has(f));
    missing = media.filter((m) => !present.has(m.fileName)).map((m) => `${m.fileName} (${m.originalName})`);
  }

  const summary = `Removed ${visits.affected ?? 0} old visit records and ${geo.affected ?? 0} expired location lookups; storage check found ${orphans.length} untracked and ${missing.length} missing files`;
  const needsAttention = orphans.length > 0 || missing.length > 0;
  // Logged as info: this task emails its own report, so an alert would duplicate it.
  await LogService.system('maintenance.monthly', summary, 'info', {
    orphans: orphans.slice(0, 50),
    missing: missing.slice(0, 50),
  });

  const to = (process.env.ALERT_EMAIL ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (needsAttention && to.length) {
    await new MailerService().send({
      to,
      subject: `${siteName()} maintenance: ${orphans.length + missing.length} storage file(s) need a look`,
      templateName: 'report',
      internal: true,
      templateData: {
        siteName: siteName(),
        kicker: 'Monthly maintenance',
        heading: 'Storage and media library are out of sync',
        intro: summary + '.',
        sections: [
          {
            title: 'In storage but not in the media library',
            rows: orphans.slice(0, 40).map((f) => ({ label: f, value: '' })),
            empty: 'None.',
          },
          {
            title: 'In the media library but missing from storage',
            rows: missing.slice(0, 40).map((f) => ({ label: f, value: '' })),
            empty: 'None.',
          },
        ],
        cta: { label: 'Open media library', href: adminLink('/media') },
        footnote: 'Nothing was deleted. Untracked files are usually leftovers from interrupted uploads; missing files show as empty image slots on the site.',
      },
    });
  }
  console.log(summary);
});
