const dummy = (_blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const favorite = blogs.reduce(
    (fav, blog) => (blog.likes > fav.likes ? blog : fav), blogs[0]
  );
  return {
    title: favorite.title, author: favorite.author, likes: favorite.likes
  };
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  const counts = new Map();
  blogs.forEach(blog => {
    counts.set(blog.author, (counts.get(blog.author) || 0) + 1);
  });

  let maxAuthor = null;
  let maxBlogs = -1;
  for (const [author, blogCount] of counts.entries()) {
    if (blogCount > maxBlogs) {
      maxBlogs = blogCount;
      maxAuthor = author;
    }
  }

  return { author: maxAuthor, blogs: maxBlogs };
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  const likeByAuthor = new Map();
  blogs.forEach(blog => {
    likeByAuthor.set(blog.author, (likeByAuthor.get(blog.author) || 0) + blog.likes);
  });

  let maxAuthor = null;
  let maxLikes = -1;
  for (const [author, totalLikes] of likeByAuthor.entries()) {
    if (totalLikes > maxLikes) {
      maxLikes = totalLikes;
      maxAuthor = author;
    }
  }

  return { author: maxAuthor, likes: maxLikes };
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}