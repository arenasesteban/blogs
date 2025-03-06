const jwt = require('jsonwebtoken');
const User = require('../models/user');

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
    if(error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    } else if(error.name === 'MongoServerError' && error.code === 11000) {
        return res.status(400).json({ error: 'username must be unique'});
    } else if (error.name ===  'JsonWebTokenError') {
        return res.status(401).json({ error: 'token invalid' });
    }

    next(error);
};

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
        req.token =  authorization.replace('Bearer ', '');
    } else {
        req.token = null;
    }

    next();
};

const userExtractor = async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET);

        if(!decodedToken.id) {
            return res.status(401).json({ error: 'token invalid' });
        }
    
        const user = await User.findById(decodedToken.id);
    
        if(!user) {
            return res.status(401).json({ error: 'user not found' });
        }

        req.user = user;

        next();
    } catch(error) {
        next(error);
    }
};

module.exports = { unknownEndpoint, errorHandler, tokenExtractor, userExtractor };