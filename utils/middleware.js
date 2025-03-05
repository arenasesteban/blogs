const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
    if(error.name === 'CastError') {
        return res.status(400).send({ error: 'Malformatted id' });
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    } else if(error.name === 'MongoServerError' && error.code === 11000) {
        return res.status(400).json({ error: 'username must be unique'});
    }

    next(error);
};

module.exports = { unknownEndpoint, errorHandler };