import asyncHandler from 'express-async-handler';
import User from '../Models/userModel.js'

import generateToken from '../utils/generateToken.js';
import { removePreviousFile } from '../utils/postUpload.js';

/*
   desc     Auth user/set token
   route    POST /api/users/auth
   access   public
*/
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))) {
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
        res.status(401);
        throw new Error('Wrong email or password');
    }
});

/*
   desc     Register user/set token
   route    POST /api/users/
   access   public
*/
const registerUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

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
        res.status(400);
        throw new Error('Invalid user data');
    }
});

/*
   desc     Logout user
   route    POST /api/users/logout
   access   public
*/
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: 'User logged out' });
});

/*
   desc     Update user profile
   route    PUT /api/users/profile
   access   private
*/
const updateUserProfile = asyncHandler(async (req, res) => {
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
        res.status(404);
        throw new Error('User not found');
    }
});

/*
   desc     Update user profile image
   route    PUT /api/users/profileimage
   access   private
*/
const uploadUserProfileImage = asyncHandler(async (req, res) => {
    const user = req.user;
    const file = req.file; // provided by multer and file is also created

    if(!user) {
        res.status(404);
        throw new Error('User not found.');
    }

    const nProfileImage = await removePreviousFile(req, res, user?.profileimage);
    user.profileimage = nProfileImage;

    // update profile image file name to database
    await user.save();

    res.status(200).json({
        profileimage: nProfileImage,
    });
});

export { 
    authUser, 
    registerUser, 
    logoutUser, 
    updateUserProfile,
    uploadUserProfileImage,
};
