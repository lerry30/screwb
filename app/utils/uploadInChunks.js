import { sendJSON } from '@/utils/send';
import { urls } from '@/constants/urls';
import * as FileSystem from 'expo-file-system';

export const uploadInChunks = async (file, fileName=`${Date.now()}.mp4`) => {
    if(!file) throw new Error('File to upload is undefined.');
    const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB per chunk

    // Read the file as a binary string
    const filePath = file.uri;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    const totalChunks = Math.ceil(fileInfo.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(fileInfo.size, start + CHUNK_SIZE);

        // Read the chunk of the file from start to end
        const fileContent = await FileSystem.readAsStringAsync(filePath, {encoding: FileSystem.EncodingType.Base64}); // Or 'utf8' depending on your needs

        const chunk = fileContent.slice(start, start+CHUNK_SIZE);
        // Upload each chunk with its index to maintain order
        const data = {
            chunk: chunk,  // Send base64-encoded chunk
            chunkIndex: i,
            totalChunks: totalChunks,
            fileName: fileName
        };

        // Post the chunk to the server
        await sendJSON(urls['uploadchunkvideos'], data, 'POST');
    }

    console.log('Upload complete');
}
