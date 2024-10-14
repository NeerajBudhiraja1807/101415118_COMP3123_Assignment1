const express = require('express');
const mongoose = require('mongoose');


const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');


const app = express();


app.use(express.json());


const DB_PASSWORD = process.env.DB_PASSWORD || 'Neeraj1807';
const MONGODB_URI = `mongodb+srv://NeerajKumar:${DB_PASSWORD}@cluster0.z71bo.mongodb.net/comp3123_assignment1?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('debug', true);


mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        process.exit(1); 
    });


mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);


app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Welcome  </h1><p>Welcome to the Home Page of My Vercel Deployement</p>');
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('Shutting down successfully');
    server.close(() => {
        console.log('Process terminated!');
    });
});
