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
  // Implementation not provided
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}