const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
    const { title, author, url, likes, userId } = req.body;

    const user = await User.findById(userId);

    const blog = new Blog({ 
        title,
        author,
        url,
        likes: likes || 0,
        user: user.id
    });

    if(!req.body.title || !req.body.url) {
        return res.status(400).json({ error: 'title or url missing'});
    }

    const savedBlog = await blog.save();

    user.blogs = [...user.blogs, savedBlog.id];
    await user.save();

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