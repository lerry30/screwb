import multer from 'multer';
import { mkdir } from 'fs/promises'
import { getDir, getFileExt } from './fileDir.js';
import { isDirExists } from './fileDir';

export const upload = async (uploadsFolder) => {
    const exists = await isDirExists(uploadsFolder);
    if(!exists) await mkdir(uploadsFolder);
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
