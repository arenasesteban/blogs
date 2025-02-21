const _ = require('lodash');

const dummy = blogs => {
    return 1;
};

const totalLikes = blogs => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = blogs => {
    if(blogs.length === 0) {
        return null;
    };

    return blogs.reduce((maxBlog, blog) =>
        blog.likes > maxBlog.likes
            ? { title: blog.title, author: blog.author, likes: blog.likes }
            : maxBlog, { title: blogs[0].title, author: blogs[0].author, likes: blogs[0].likes });
};

const mostBlogs = blogs => {
    if(blogs.length === 0) {
        return null;
    };

    return Object.entries(_.groupBy(blogs, 'author'))
        .map(([author, posts]) => ({
            author,
            blogs: posts.length
        }))
        .reduce((max, current) =>
            current.blogs > max.blogs ? current : max, { author: '', blogs: 0 });
};

const mostLikes = blogs => {
    if(blogs.length === 0) {
        return null;
    };

    return Object.entries(_.groupBy(blogs, 'author'))
        .map(([author, posts]) => ({
            author, 
            likes: posts.reduce((acc, post) => acc + post.likes, 0)
        }))
        .reduce((max, current) =>
            current.likes > max.likes ? current : max, { author: '', likes: 0 });
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };