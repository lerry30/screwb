import Post from '../Models/postModel.js';
import fs from 'fs';

import { getDir, isDirExists } from '../utils/fileDir.js';
import { removePreviousFile } from '../utils/postUpload.js';

/*
   desc     Create post
   route    POST /api/posts/create
   access   private
*/
const createPost = async (req, res) => {
    try {
        const { title, description, filename } = req.body;
        const userId = req.user._id;

        if(!userId) throw new Error('User not found');
        if(!title) throw new Error('Title is empty.');
        if(!description) throw new Error('Description is empty.');
 
        //const nVideo = await removePreviousFile(req, res, undefined);
        const post = await Post.create({ userId, title, description, video: filename });

        if(post) {
            res.status(201).json({
                id: post._id,
                title: post.title,
                description: post.description,
                video: filename
            });
        } else {
            throw new Error('Invalid post data');
        }
    } catch(error) {
        const video =`${getDir('uploads')}/videos/${req.body?.filename}`;
        if(fs.statSync(video)) fs.unlinkSync(video);
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

const uploadInChunks = async (req, res) => {
    try {
        const { chunk, chunkIndex, totalChunks, fileName } = req.body;
        const uploadsDir = getDir('uploads');

        // Convert the base64 chunk back to binary
        const buffer = Buffer.from(chunk, 'base64');

        // Create a temporary directory to store the chunks if not existing
        const tempDir = `${uploadsDir}/temp`;
        if (!(await isDirExists(tempDir))) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Write each chunk to a separate file
        const chunkFilePath = `${tempDir}/chunk-${chunkIndex}-${fileName}`;
        fs.writeFileSync(chunkFilePath, buffer);

        console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded for file ${fileName}`);

        // If it's the last chunk, merge all the chunks into the final file
        if (parseInt(chunkIndex) === totalChunks - 1) {
            const uploadsVideoDir = `${uploadsDir}/videos`;
            const finalFilePath = `${uploadsVideoDir}/${fileName}`;
            if(!(await isDirExists(uploadsVideoDir))) fs.mkdirSync(uploadsVideoDir);
            const writeStream = fs.createWriteStream(finalFilePath);

            for (let i = 0; i < totalChunks; i++) {
                const chunkPath = `${tempDir}/chunk-${i}-${fileName}`;
                const data = fs.readFileSync(chunkPath);
                writeStream.write(data);
                fs.unlinkSync(chunkPath); // Clean up the chunk file
            }

            writeStream.end(() => {
                console.log(`File ${fileName} successfully uploaded and combined.`);
                res.status(200).json({message: 'Upload complete'});
            });
        } else {
            res.status(200).json({message: 'Chunk received'});
        }
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

export { 
    createPost, 
    uploadInChunks,
};
