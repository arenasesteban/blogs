const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
    res.json(users);
});

usersRouter.post('/', async (req, res, next) => {
    try {
        const { username, name, password } = req.body;

        if(password.length < 3) {
            return res.status(400).json({ error: 'password is shortan than the minimum allowed length' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new User({
            username, 
            name,
            hash
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch(error) {
        next(error);
    }
});

module.exports = usersRouter;