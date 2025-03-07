const mongoose = require('mongoose');

const initialUsers = [
    {
        _id: new mongoose.Types.ObjectId(),
        username: 'michaelchan',
        name: 'Michael Chan',
        hash: '$2b$10$ARj2DNh.jPoZZsD.0WK1Heb5GjR6VjtsOm310lFQQxRcPRvPu4Eva'
    },
    {
        _id: new mongoose.Types.ObjectId(),
        username: 'edsgerwdijkstra',
        name: 'Edsger W. Dijkstra',
        hash: '$2b$10$ARj2DNh.jPoZZsD.0WK1Heb5GjR6VjtsOm310lFQQxRcPRvPu4Eva'
    },
    {
        _id: new mongoose.Types.ObjectId(),
        username: 'robertcmartin',
        name: 'Robert C. Martin',
        hash: '$2b$10$ARj2DNh.jPoZZsD.0WK1Heb5GjR6VjtsOm310lFQQxRcPRvPu4Eva'
    }
];

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        user: initialUsers[0]._id
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        user: initialUsers[1]._id
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        user: initialUsers[1]._id
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        user: initialUsers[2]._id
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        user: initialUsers[2]._id
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        user: initialUsers[2]._id
    }  
];

module.exports = { initialBlogs, initialUsers };