import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import { 
    giveFeedback,
    getUserReactions,
    getPostReactions,
} from '../controllers/feedbackController.js';

const router = express.Router();
router.put('/', protect, giveFeedback);
router.post('/user', protect, getUserReactions);
router.get('/post', getPostReactions);

export default router;
