import express from 'express';
import { upload } from '../utils/multerConfig.js';
import { protect } from '../middleware/authMiddleware.js';

import { 
    authUser, 
    registerUser, 
    logoutUser, 
    updateUserProfile,
    uploadUserProfileImage,
} from '../controllers/userController.js';

const router = express.Router();

(async () => {
    const uploadMiddleware = await upload('profiles');

    router.post('/', registerUser);
    router.post('/auth', authUser);
    router.post('/logout', logoutUser);
    router.put('/profile', uploadMiddleware.single('file'), protect, updateUserProfile);
    router.put('/profileimage', uploadMiddleware.single('file'), protect, uploadUserProfileImage);
})();

export default router;
