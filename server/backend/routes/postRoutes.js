import express from 'express';
import { upload } from '../utils/multerConfig.js';
import { protect } from '../middleware/authMiddleware.js';

import { 
    createPost,
} from '../controllers/postController.js';

const router = express.Router();

(async () => {
    const uploadMiddleware = await upload('videos');
    router.post('/create', uploadMiddleware.single('file'), protect, createPost);
})();

export default router;
