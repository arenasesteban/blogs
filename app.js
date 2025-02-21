const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();

mongoose.set('strictQuery', false);

const url = config.MONGODB_URI;

mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log('Error connecting to MongoDB:', error));

app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/api/blogs', blogsRouter);

module.exports = app;