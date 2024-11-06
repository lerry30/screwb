import Feedback from '../Models/feedbackModel.js'
import UserReaction from '../Models/userReaction.js';
import { toNumber } from '../utils/number.js';

/*
   desc     Update feedback
   route    PUT /feedback
   access   private
*/
const giveFeedback = async (req, res) => {
    try {
        const { postId, feedback } = req.body;
        const userId = req.user._id.toString();

        if(!userId) throw new Error('User not found');
        if(!postId) throw new Error('The video is not recognized.');
        
        const saveFeedback = await Feedback.findOne({postId});
        let nFeedback = null;
        if(saveFeedback) {
            const saveUserReaction = await UserReaction.findOne({userId, postId});
            if(!saveUserReaction) {
                await UserReaction.create({userId, postId, reactions: [feedback]});
                saveFeedback[feedback] = toNumber(saveFeedback[feedback])+1;
            } else {
                const reactions = saveUserReaction.reactions;
                if(reactions.includes(feedback)) {
                    const newList = saveUserReaction.reactions.filter(act => act !== feedback);
                    const noOfFeedback = Math.max(toNumber(saveFeedback[feedback])-1, 0);
                    saveUserReaction.reactions = newList; 
                    saveFeedback[feedback] = noOfFeedback;
                } else {
                    saveUserReaction.reactions.push(feedback);
                    saveFeedback[feedback] = toNumber(saveFeedback[feedback])+1;
                }

                await saveUserReaction.save();
            }

            nFeedback = await saveFeedback.save();
        } else {
            nFeedback = await Feedback.create({postId, [feedback]: 1});
            await UserReaction.create({userId, postId, reactions: [feedback]});
        }

        if(nFeedback) {
            res.status(201).json({
                id: nFeedback._id,
                postId: nFeedback.postId,
                heart: nFeedback.heart,
                like: nFeedback.like,
                dislike: nFeedback.dislike,
                haha: nFeedback.haha,
            });
        } else {
            throw new Error('Invalid feedback data');
        }
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

/*
   desc     Get user reaction
   route    POST /feedback/user
   access   private
*/
const getUserReactions = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id.toString(); 

        if(!userId) throw new Error('User not found');
        if(!postId) throw new Error('The video is not recognized.');

        const userReaction = await UserReaction.findOne({userId, postId});

        if(userReaction) {
            res.status(201).json({
                id: userReaction._id.toString(),
                userId: userReaction.userId,
                postId: userReaction.postId,
                reactions: userReaction.reactions
            });
        } else {
            res.status(400);
            throw new Error('User post no feedback yet.');
        }
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

/*
   desc     Get post reactions
   route    GET /feedback/post
   access   public
*/
const getPostReactions = async (req, res) => { 
    try {
        const postId = req?.query?.id; 
        if(!postId) throw new Error('The video is not recognized.');
        
        const feedbacks = await Feedback.findOne({postId});

        if(feedbacks) {
            res.status(201).json({
                id: feedbacks._id,
                postId: feedbacks.postId,
                heart: feedbacks.heart,
                like: feedbacks.like,
                dislike: feedbacks.dislike,
                haha: feedbacks.haha,
            });
        } else {
            res.status(400);
            throw new Error('No feedbacks yet.');
        }
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

export { 
    giveFeedback,
    getUserReactions,
    getPostReactions
};
