const { test, describe } = require('node:test');
const assert = require('node:assert');
const { dummy, totalLikes, favoriteBlog } = require('../utils/list_helper');

const listWithoutBlogs = [];

const listWithOneBlog = [
    {
        id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    }
];

const listWithMultipliesBlogs = [
    {
        id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }  
];

test('dummy returns one', () => {
    const blogs = [];

    const result = dummy(blogs);
    assert.strictEqual(result, 1);
});

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = totalLikes(listWithoutBlogs);
        assert.strictEqual(result, 0);
    });

    test('when list has only blog equals the likes of that', () => {
        const result = totalLikes(listWithOneBlog);
        assert.strictEqual(result, 7);
    });

    test('of a bigger list is calculated right', () => {
        const result = totalLikes(listWithMultipliesBlogs);
        assert.strictEqual(result, 36);
    });
});

describe('favorite blogs', () => {
    test('returns null for an empty list', () => {
        const result = favoriteBlog(listWithoutBlogs);
        assert.strictEqual(result, null);
    });

    test('return the only blog when ehre is one', () => {
        const result = favoriteBlog(listWithOneBlog);
        const expected = { title: 'React patterns', author: 'Michael Chan', likes: 7 };
        assert.deepStrictEqual(result, expected);
    });
    
    test('returns the blog with most likes', () => {
        const result = favoriteBlog(listWithMultipliesBlogs);
        const expected = { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 };
        assert.deepStrictEqual(result, expected);
    });
});

