require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/part4'
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs)
  })
})

app.post('/api/blogs', (req, res) => {
  const blog = new Blog(req.body)

  blog.save().then((savedBlog) => {
    res.status(201).json(savedBlog)
  })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})