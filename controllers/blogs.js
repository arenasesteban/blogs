const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
    const blog = new Blog({ 
        ...req.body,
        likes: req.body.likes || 0
    });

    if(!req.body.title || !req.body.url) {
        return res.status(400).json({ error: 'title or url missing'});
    }

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
});

module.exports = blogsRouter;