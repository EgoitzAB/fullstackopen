const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (_request, response) => {
  const blog = await Blog.findById(_request.params.id).populate('user', { username: 1, name: 1 }) 
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  
  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id) // Temporary: associate all blogs to the first user
  if (!user) {
    return response.status(401).json({ error: 'no users found to associate blog with' })
  }
  
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populated = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(populated)
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  
  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  const ownerId = 
  blog.user && blog.user._id
    ? blog.user._id.toString()
    : blog.user
      ? blog.user.toString()
      : null

  if (!ownerId) {
    return response.status(500).json({ error: 'blog has no owner, cannot verify permission to delete' })
  }
  if (ownerId !== decodedToken.id) {
    return response.status(403).json({ error: 'only the creator can delete a blog' })
  }
  
  await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
