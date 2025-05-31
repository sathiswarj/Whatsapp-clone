import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import userRoutes from './routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the 'uploads' directory
// This allows access to uploaded files via a URL like http://localhost:PORT/uploads/filename.jpg
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// Load environment variables from .env file


dotenv.config();

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

app.use('/api/users', userRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});