import multer from 'multer';

export const upload = multer({ storage: multer.memoryStorage() });
export const uploadFiles = multer({ storage: multer.memoryStorage() }).array(
  'files',
  5
); // Limit to 5 files

export const uploadSingleFile = multer({
  storage: multer.memoryStorage(),
}).single('file'); // For single file upload
