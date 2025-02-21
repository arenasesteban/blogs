const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return null;
    };

    return blogs.reduce((maxBlog, blog) =>
        blog.likes > maxBlog.likes
            ? { title: blog.title, author: blog.author, likes: blog.likes }
            : maxBlog, 
    { title: blogs[0].title, author: blogs[0].author, likes: blogs[0].likes });
};

module.exports = { dummy, totalLikes, favoriteBlog };