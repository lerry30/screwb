import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import { 
    createPost,
    uploadInChunks
} from '../controllers/postController.js';

const router = express.Router();

router.post('/upload/video', uploadInChunks);
router.post('/create', protect, createPost);

export default router;
