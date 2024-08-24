import { getDir } from './fileDir.js';
import * as nFs from 'fs/promises'
import fs from 'fs';

export const removePreviousFile = async (req, res, prevFile, required=true) => {
    const file = req.file; // provided by multer and file is also created
    const filename = file?.filename || prevFile;

    if(!file && required) {
        res.status(400);
        throw new Error('No file uploaded.');
    }

    // remove the old profile picture
    if(file && prevFile) {
        const filepath = getDir('uploads/profiles/') + prevFile;
        if(fs.existsSync(filepath))
            await nFs.unlink(filepath);
    }

    return filename;
}
