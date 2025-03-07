const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const passwordCorrect = user === null 
        ? false
        : await bcrypt.compare(password, user.hash);
    
    if(!(user && passwordCorrect)) {
        return res.status(400).json({ error: 'invalid username or password'});
    }

    const userForToken = {
        username: user.username,
        id: user.id
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;