import multer from 'multer';
import { mkdir } from 'fs/promises'
import { getDir, getFileExt, isDirExists } from './fileDir.js';

export const upload = async (uploadsFolder) => {
    const uploadRootPath = getDir(`uploads/${uploadsFolder}`);
    const exists = await isDirExists(uploadRootPath);
    if(!exists) await mkdir(uploadRootPath);
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadRootPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + getFileExt(file.originalname));  // Example for setting a unique filename
        }
    });

    return multer({ storage: storage, limits: {fileSize: 10 * 1024 * 1024} });
}
