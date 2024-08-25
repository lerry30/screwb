import asyncHandler from 'express-async-handler';
import Post from '../Models/postModel.js'

import { removePreviousFile } from '../utils/postUpload.js';

/*
   desc     Create post
   route    POST /api/posts/create
   access   private
*/
const createPost = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user._id;

    if(!userId) {
        res.status(400);
        throw new Error('User not found');
    }

    if(!title) {
        res.status(400);
        throw new Error('Title is empty.');
    }

    if(!description) {
        res.status(400);
        throw new Error('Description is empty.');
    }
    
    const nVideo = await removePreviousFile(req, res, undefined);
    const post = await Post.create({ userId, title, description, video: nVideo });

    if(post) {
        res.status(201).json({
            id: post._id,
            title: post.title,
            description: post.description,
            video: nVideo,
        });
    } else {
        res.status(400);
        throw new Error('Invalid post data');
    }
});

export { 
    createPost, 
};
