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

blogsRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);

    res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: 'query' });

    res.status(200).json(updatedBlog);
});

module.exports = blogsRouter;