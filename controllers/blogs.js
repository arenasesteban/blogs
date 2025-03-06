const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1});
    res.json(blogs);
});

blogsRouter.post('/',  middleware.userExtractor, async (req, res, next) => {
    try {
        const { title, author, url, likes } = req.body;

        const user = await User.findById(req.user.id);

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

blogsRouter.delete('/:id',  middleware.userExtractor, async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
 
        if(req.user.id !== blog.user.toString()) {
            return res.status(401).json({ error: 'permission denied' });
        }

        await Blog.findByIdAndDelete(blog.id);
    
        res.status(204).end();
    } catch(error) {
        next(error);
    }
});

blogsRouter.put('/:id', async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: 'query' });

    res.status(200).json(updatedBlog);
});

module.exports = blogsRouter;