const { test, describe, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

let loginResponse = '';

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);

    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);

    const user = {
        username: 'robertcmartin',
        password: 'defaultpassword'
    };

    const response = await api.post('/api/login').send(user).expect(200);

    loginResponse = response.body;
});

test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test('unique identifier called id', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.every(blog => blog.id && !blog._id), true);
});

test('a valid blog can be added', async () => {
    const blogsAtStart = await Blog.find({});

    const newBlog = {
        title: 'FP vs. OO List Processing',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 0,
    };

    await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${loginResponse.token}`).expect(201).expect('Content-Type', /application\/json/);

    const blogsAtEnd = await Blog.find({});

    const titles = blogsAtEnd.map(e => e.title);

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
    assert(titles.includes('Type wars'));
});

test('likes is set to 0 by default if not provided', async () => {
    const newBlog = {
        title: 'FP vs. OO List Processing',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    };

    const response = await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${loginResponse.token}`).expect(201).expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
});

test('responds with status 400 if title or url is missing', async () => {
    const newBlog = { author: 'Robert C. Martin' };

    await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${loginResponse.token}`).expect(400);
});

test('succeeds with status code 204 if blog has been deleted', async () => {
    const blogsAtStart = await  Blog.find({});

    const userId = await User.exists({ username: loginResponse.username });
    const blogToDelete = await Blog.findOne({ user: userId });

    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${loginResponse.token}`).expect(204);

    const blogsAtEnd = await Blog.find({});

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
});

test('updates the likes of a blog', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];
    const updatedLikes = 15;
    
    await api.put(`/api/blogs/${blogToUpdate.id}`).send({ likes: updatedLikes }).expect(200);

    const blogsAtEnd = await Blog.find({});

    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);

    assert.strictEqual(updatedBlog.likes, updatedLikes);
});

describe('user creation test', () => {
    test('password shorter than 3 characers', async () => {
        const newUser = {
            username: 'johndoe',
            name: 'John Doe',
            password: 'pw'
        };

        const response = await api.post('/api/users').send(newUser).expect(400);
        
        assert.strictEqual(response.body.error, 'password is shortan than the minimum allowed length');
    });

    test('username is not unique', async () => {
        const newUser = {
            username: 'michaelchan',
            name: 'Michael Chan',
            password: 'defaultpassword'
        };

        const response = await api.post('/api/users').send(newUser).expect(400);

        assert.strictEqual(response.body.error, 'username must be unique');
    });
});

after(async () => {
    await mongoose.connection.close();
});