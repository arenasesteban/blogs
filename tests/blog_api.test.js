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

    const blogsAtEnd = await Blog.find({});

    const titles = blogsAtEnd.map(e => e.title);

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
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

test('responds with status 400 if title or url is missing', async () => {
    const newBlog = { author: 'Robert C. Martin' };

    await api.post('/api/blogs').send(newBlog).expect(400);
});

test('succeeds with status code 204 if blog has been deleted', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = await blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await Blog.find({});

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
});

after(async () => {
    await mongoose.connection.close();
});