const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');

beforeEach(async () => {
    await Blog.deleteMany({});

    await Blog.insertMany(helper.initialBlogs);
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
    const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    };

    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const titles = response.body.map(e => e.title);

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
    assert(titles.includes('Type wars'));
});

test('likes is set to 0 by default if not provided', async () => {
    const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    };

    const response = await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
});

after(async () => {
    await mongoose.connection.close();
});