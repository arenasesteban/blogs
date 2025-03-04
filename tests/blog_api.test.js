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

after(async () => {
    await mongoose.connection.close();
});