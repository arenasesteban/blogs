const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = req => {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }

    return null;
};

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1});
    res.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
    try {
        const { title, author, url, likes } = req.body;

        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

        if(!decodedToken.id) {
            return res.status(401).json({ error: 'token invalid' });
        }

        const user = await User.findById(decodedToken.id);

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
    } catch(error) {
        next(error);
    }
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