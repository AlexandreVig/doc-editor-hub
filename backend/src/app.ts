import express from 'express';
import 'dotenv/config';
import connectDB from './config/db';
import documentRoutes from './routes/documentRoutes';
import authRoutes from './routes/authRoutes';
//import userRoutes from './routes/userRoutes';*/

const app = express();

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/auth', authRoutes);
//app.use('/api/users', userRoutes);*/

export default app;
