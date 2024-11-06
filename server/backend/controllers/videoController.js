import Post from '../Models/postModel.js'
import User from '../Models/userModel.js';
import Feedback from '../Models/feedbackModel.js';

import { toNumber } from '../utils/number.js';

// it is just a function to get posts users. Since I don't want
// to make my utils folder crowded by so many utilities which use
// only twice.
const extractDataNeeded = async (user, post) => {
    const postId = post._id.toString();

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

    return {
        userId: user._id, 
        firstname: user.firstname, 
        lastname: user.lastname, 
        profileimage: user.profileimage,

        videoId: postId, 
        title: post.title, 
        description: post.description, 
        video: post.video,

        ...feedbackData,
    };
}

const mergeUserAndPost = async (posts) => {
    try {
        const data = [];
        for(const post of posts) {
            const userId = post?.userId;
            if(!userId) {
                console.log('Warning a certain post has not user associated.');
                continue;
            }

            const user = await User.findById(userId);
            const userAndPosts = await extractDataNeeded(user, post);
            data.push(userAndPosts);
        }

        return data;
    } catch(error) {
        console.log(error?.message);
    }
}

/*
   desc     Get videos
   route    GET /api/videos?count=4&slice=1
   access   public
*/
const getVideos = async (req, res) => {
    try {
        const countOfVideos = toNumber(req.query.count) || 4;
        const fetchSlice = toNumber(req.query.slice) * countOfVideos;

        const posts = await Post.find({}).sort({_id:-1, createdAt:-1}).skip(fetchSlice).limit(countOfVideos);
        const data = await mergeUserAndPost(posts);
        res.status(200).json(data);
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

/*
   desc     Get searched videos
   route    GET /api/videos/search?for=topic
   access   public
*/
const searchVideos = async (req, res) => {
    try {
        const searchTerm = req.query?.for?.toString().trim().toLowerCase();

        if(!searchTerm) {
            res.status(404);
            throw new Error('Search value is empty.');
        }

        const posts = await Post.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for title
                { description: { $regex: searchTerm, $options: 'i' } } // Case-insensitive search for content
            ]
        }).sort({_id:-1, createdAt:-1});
        
        const users = await User.find({
            $or: [
                { firstname: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for title
                { lastname: { $regex: searchTerm, $options: 'i' } } // Case-insensitive search for content
            ]
        }).sort({_id:-1, createdAt:-1});

        const fData = await mergeUserAndPost(posts); 
        const sData = [];

        // save first data ids and verify
        // if already in the list to prevent
        // another instance of post
        const fPostIds = {};
        for(const item of fData) {
            const key = item.videoId;
            fPostIds[key] = true;
        }


        for(const user of users) {
            const userId = user._id.toString(); 
            // I will check if the first data from posts searched contains
            // enough data to display and to only get user's latest post so the
            // data is not huge, if not it would proceed to display all user's
            // posts.
            if(fData.length > 3) {
                const post = await Post.findOne({userId}).sort({createdAt:-1});
                const postId = post?._id?.toString() || 'unavailable';
                if(!post || fPostIds[postId]) {
                    console.log('User doesn\'t have any post yet or maybe already in the list to prevent duplicates.');
                    continue;
                }
                
                const userAndPost = await extractDataNeeded(user, post);
                sData.push(userAndPost);
            } else {
                const posts = await Post.find({userId}).sort({createdAt:-1}).limit(4);
                for(const post of posts) {
                    const postId = post._id.toString();
                    if(fPostIds[postId]) { 
                        console.log('User already in the list to prevent duplicates.');
                        continue;
                    }

                    const userAndPost = await extractDataNeeded(user, post);
                    sData.push(userAndPost);
                }
            }
        }

        res.status(200).json([...fData, ...sData]);
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

export { 
    getVideos,
    searchVideos,
};
