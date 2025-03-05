const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

usersRouter.get('/', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
        username, 
        name,
        hash
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
});

module.exports = usersRouter;