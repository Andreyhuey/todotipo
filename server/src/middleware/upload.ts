import multer from 'multer';
import { HttpError } from '../helpers/http';

const MAX_MB = Number(process.env.MEDIA_MAX_UPLOAD_MB || 100);

/** Admin media uploads: images and videos only, up to 20 per request. */
export const uploadMedia = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_MB * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) cb(null, true);
    else cb(new HttpError(415, `Unsupported file type: ${file.mimetype}`));
  },
}).array('files', 20);
