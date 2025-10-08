const { test, beforeEach, after, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const config = require('../utils/config')


before(async () => {
  await mongoose.connect(config.MONGODB_URI)
});

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  assert.ok(titles.includes('Go To Statement Considered Harmful'))
})

after(async () => {
  await mongoose.connection.close()
})

test('blogs have id property', async () => {
  const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

  for (const blog of response.body) {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
    assert.strictEqual(blog.__v, undefined) 
  }
})