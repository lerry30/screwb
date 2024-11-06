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
    router.put('/profile', protect, uploadMiddleware.single('file'), updateUserProfile);
    router.put('/profileimage', protect, uploadMiddleware.single('file'), uploadUserProfileImage);
})();

export default router;
