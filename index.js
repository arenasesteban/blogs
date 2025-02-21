const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const Blog = require('./models/blog');

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (req, res) => {
    Blog.find({})
        .then(blogs => {
            res.json(blogs);
        });
});

app.post('/api/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then(savedBlog => {
            res.status(201).json(savedBlog);
        });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});