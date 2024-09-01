import mongoose from 'mongoose';

const userReactionSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    postId: {
        type: String,
        required: true,
    },

    reactions: {
        type: [String],
        required: true
    },
}, {
    timestamps: true
});

const UserReaction = mongoose.model('UserReaction', userReactionSchema);

export default UserReaction;
