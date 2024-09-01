import asyncHandler from 'express-async-handler';
import Post from '../Models/postModel.js'
import User from '../Models/userModel.js';
import Feedback from '../Models/feedbackModel.js';

import { toNumber } from '../utils/number.js';

/*
   desc     Get videos
   route    GET /api/videos
   access   public
*/
const getVideos = asyncHandler(async (req, res) => {
    const countOfVideos = toNumber(req.query.count) || 4;
    const fetchSlice = toNumber(req.query.slice) * countOfVideos;

    const posts = await Post.find({}).sort({_id:-1, createdAt:-1}).skip(fetchSlice).limit(countOfVideos);
    const data = [];
    for(const post of posts) {
        const userId = post?.userId;
        const postId = post?._id?.toString();
        if(!userId) {
            console.log('Warning a certain post has not user associated.');
            continue;
        }

        const user = await User.findById(userId);
        const feedback = await Feedback.findOne({postId});
        const feedbackData = feedback ? {
            feedbackId: feedback?._id,
            heart: feedback?.heart,
            like: feedback?.like,
            dislike: feedback?.dislike,
            haha: feedback?.haha,
        } : {
            feedbackId: null,
            heart: 0,
            like: 0,
            dislike: 0,
            haha: 0,
        }

        // I decided to merge the data in a single object
        data.push({
            userId: user._id, 
            firstname: user.firstname, 
            lastname: user.lastname, 
            profileimage: user.profileimage,

            videoId: postId, 
            title: post.title, 
            description: post.description, 
            video: post.video,

            ...feedbackData,
        });
    }

    res.status(200).json(data);
});

export { 
    getVideos,
};
