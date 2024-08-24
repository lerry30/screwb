import multer from 'multer';
import { getDir, getFileExt } from './fileDir.js';

export const upload = (uploadsFolder) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, getDir(`uploads/${uploadsFolder}`));  // Assuming __dirname is /backend
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + getFileExt(file.originalname));  // Example for setting a unique filename
        }
    });

    return multer({ storage: storage });
}
