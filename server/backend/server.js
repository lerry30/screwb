import express from 'express';
import dotenv from 'dotenv';
//import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
//import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { getDir } from './utils/fileDir.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// database
// if it cannot connect to database, it would run process.exit(1), which terminate the program
connectDB();

// in order to use req.body
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true }));
app.use('/profiles', express.static(getDir('uploads/profiles')));
app.use('/videos', express.static(getDir('uploads/videos')))
// Allow all origins for development
//app.use(cors({
//    origin: true,   // Allow any origin (or replace with your specific origin in production)
//    credentials: true,  // Allow cookies or other credentials to be sent
//    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific methods
//    allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
//}));

// router
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/feedback', feedbackRoutes);

// fall back when route is not found
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Screwb server is running on port ${port}`));
