import User from '../Models/userModel.js';
import Post from '../Models/postModel.js';

import generateToken from '../utils/generateToken.js';
import { removePreviousFile } from '../utils/postUpload.js';

/*
   desc     Auth user/set token
   route    POST /api/users/auth
   access   public
*/
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(user && (await user.matchPassword(password))) {
            const token = generateToken(res, user._id);

            // I decided to include user posts in this payload
            const posts = await Post.find({userId: user._id}).sort({createdAt: -1});

            res.status(201).json({
                id: user._id,
                token: token,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                profileimage: user.profileimage,
                posts: posts
            });
        } else {
            res.status(401);
            throw new Error('Wrong email or password');
        }
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

/*
   desc     Register user/set token
   route    POST /api/users/
   access   public
*/
const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if(userExists) throw new Error('User already exists');

        const user = await User.create({ firstname, lastname, email, password });

        if(user) {
            const token = generateToken(res, user._id);
            res.status(201).json({
                id: user._id,
                token: token,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                profileimage: user.profileimage,
            });
        } else {
            throw new Error('Invalid user data');
        }
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}
/*
   desc     Logout user
   route    POST /api/users/logout
   access   public
*/
const logoutUser = async (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({ message: 'User logged out' });
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

/*
   desc     Update user profile
   route    PUT /api/users/profile
   access   private
*/
const updateUserProfile = async (req, res) => {
    try {
        // const user = await User.findById(req.user._id);
        const user = req.user;

        if(user) {
            user.firstname = req.body.firstname || user.firstname;
            user.lastname = req.body.lastname || user.lastname;
            user.email = req.body.email || user.email;

            if(req.body.password) {
                user.password = req.body.password;
            }

            const nProfileImage = await removePreviousFile(req, res, user?.profileimage, false);
            user.profileimage = nProfileImage;

            const updatedUser = await user.save();

            res.status(200).json({
                id: updatedUser._id,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                email: updatedUser.email,
                profileimage: updatedUser.profileimage,
            });
        } else {
            throw new Error('User not found');
        }
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

/*
   desc     Update user profile image
   route    PUT /api/users/profileimage
   access   private
*/
const uploadUserProfileImage = async (req, res) => {
    try {
        const user = req.user;
        const file = req.file; // provided by multer and file is also created

        if(!user) throw new Error('User not found.');

        const nProfileImage = await removePreviousFile(req, res, user?.profileimage);
        user.profileimage = nProfileImage;

        // update profile image file name to database
        await user.save();

        res.status(200).json({
            profileimage: nProfileImage,
        });
    } catch(error) {
        console.log(error?.message);
        res.status(400).json({message: 'There\'s something wrong.'});
    }
}

export { 
    authUser, 
    registerUser, 
    logoutUser, 
    updateUserProfile,
    uploadUserProfileImage,
};
