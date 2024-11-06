import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

const protect = async (req, res, next) => {
    try {
        //const token = req.cookies.jwt;
        const token = req.body.token;

        if(token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.userId).select('-password');
                next();
            } catch(error) {
                res.status(401);
                throw new Error('Not authorized, invalid token');
            }
        } else {
            res.status(401);
            throw new Error('Not authorized, no token');
        }
    } catch(error) {
        console.log(error);
    }
}

export { protect };
