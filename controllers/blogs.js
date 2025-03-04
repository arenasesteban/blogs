const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

blogsRouter.post('/', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then(savedBlog => {
            res.status(201).json(savedBlog);
        });
});

module.exports = blogsRouter;