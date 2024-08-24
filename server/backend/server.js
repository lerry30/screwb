import express from 'express';
import dotenv from 'dotenv';
//import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
//import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { getDir, getFileExt } from './utils/fileDir.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// database
// if it cannot connect to database, it would run process.exit(1), which terminate the program
connectDB();

// in order to use req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/profiles', express.static(getDir('uploads/profiles')));
//app.use(cookieParser());
//app.use(cors({ origin: true, credentials: true }));

// router
app.use('/api/users', userRoutes);

// fall back when route is not found
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
