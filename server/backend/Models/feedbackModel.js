import mongoose from 'mongoose';

const feedbackSchema = mongoose.Schema({
    postId: {
        type: String,
        required: true,
    },

    heart: {
        type: Number,
        default: 0
    },

    like: {
        type: Number,
        default: 0
    },


    dislike: {
        type: Number,
        default: 0
    },

    haha: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
