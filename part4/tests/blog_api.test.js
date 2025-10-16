const { test, beforeEach, after, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const config = require('../utils/config')
const User = require('../models/user')
const bcrypt = require('bcrypt')

let authToken


before(async () => {
  await mongoose.connect(config.MONGODB_URI)
});

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  await new User({ username: 'root', name: 'Superuser', passwordHash }).save()
  
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)

  authToken = loginResponse.body.token

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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'John Doe',
    url: 'http://example.com/new-blog-post',
    likes: 5,
  }

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.ok(postResponse.body.id)
    assert.equal(postResponse.body._id, undefined)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('New Blog Post'))
})

test('if likes property is missing, it will default to 0', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'Jane Doe',
    url: 'http://example.com/blog-without-likes',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)

  const blogsAtEnd = await helper.blogsInDb()
  const addedBlog = blogsAtEnd.find(b => b.title === 'Blog Without Likes')
  assert.ok(addedBlog)
  assert.strictEqual(addedBlog.likes, 0)
})

test('blog without title and url is not added', async () => {
  const newBlog = {
    author: 'No Title and URL',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test ('a blog without url is not added', async () => {
  const newBlog = {
    title: 'No URL Blog',
    author: 'Author',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test ('a blog without title is not added', async () => {
  const newBlog = {
    author: 'Author',
    url: 'http://example.com/no-title-blog',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


test('a blog can be viewed by id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]

  const response = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(response.body.id, blogToView.id)
  assert.deepStrictEqual(response.body.title, blogToView.title)
  assert.deepStrictEqual(response.body.author, blogToView.author)
  assert.deepStrictEqual(response.body.url, blogToView.url)
  assert.deepStrictEqual(response.body.likes, blogToView.likes)
})

test( 'getting a blog with a non-existing id returns 404', async () => {
  const validNonExistingId = await helper.nonExistingId()

  await api
    .get(`/api/blogs/${validNonExistingId}`)
    .expect(404)
})

test('getting a blog with an invalid id returns 400', async () => {
  const invalidId = '12345invalid'

  await api
    .get(`/api/blogs/${invalidId}`)
    .expect(400)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = {
    title: 'Updated Title',
    author: 'Updated Author',
    url: 'http://example.com/updated-url',
    likes: 10,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(response.body.title, updatedBlogData.title)
  assert.deepStrictEqual(response.body.author, updatedBlogData.author)
  assert.deepStrictEqual(response.body.url, updatedBlogData.url)
  assert.deepStrictEqual(response.body.likes, updatedBlogData.likes)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.ok(updatedBlog)
  assert.deepStrictEqual(updatedBlog.title, updatedBlogData.title)
  assert.deepStrictEqual(updatedBlog.author, updatedBlogData.author)
  assert.deepStrictEqual(updatedBlog.url, updatedBlogData.url)
  assert.deepStrictEqual(updatedBlog.likes, updatedBlogData.likes)
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized Blog Post',
    author: 'John Doe',
    url: 'http://example.com/unauthorized-blog-post',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('creater can delete their blog', async () => {
  const createResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      title: 'Blog to be deleted',
      author: 'Deleter',
      url: 'http://example.com/blog-to-be-deleted',
      likes: 1,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogId = createResponse.body.id

  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const ids = blogsAtEnd.map(b => b.id)
  assert.ok(!ids.includes(blogId))
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('deletion fails with 401 if not the creator', async () => {
  const createResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      title: 'Blog that should not be deleted',
      author: 'Another User',
      url: 'http://example.com/blog-that-should-not-be-deleted',
      likes: 1,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  await api
    .delete(`/api/blogs/${createResponse.body.id}`)
    .expect(401)
  
  })

test('non-owner cannot delete a blog', async () => {
  const createResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      title: 'Blog that should not be deleted by non-owner',
      author: 'Owner',
      url: 'http://example.com/blog-that-should-not-be-deleted-by-non-owner',
      likes: 1,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/users')
    .send({
      username: 'anotheruser',
      name: 'Another User',
      password: 'password123'
    })
    .expect(201)
  
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'anotheruser', password: 'password123' })
    .expect(200)

  const anotherAuthToken = `Bearer ${loginResponse.body.token}`

  await api
    .delete(`/api/blogs/${createResponse.body.id}`)
    .set('Authorization', anotherAuthToken)
    .expect(403)
})

test('created blog is linked to the user', async () => {
  const usersResponse = await api.get('/api/users').expect(200)
  const root = usersResponse.body.find(u => u.username === 'root')
  assert.ok(root)
  assert.strictEqual(root.blogs.length, 0)

  const createResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      title: 'Blog linked to user',
      author: 'User Link',
      url: 'http://example.com/blog-linked-to-user',
      likes: 1,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(createResponse.body.user.username, 'root')
  assert.strictEqual(createResponse.body.user.name, 'Superuser')

  const getById = await api
    .get(`/api/blogs/${createResponse.body.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(getById.body.user.username, 'root')
  assert.strictEqual(getById.body.user.name, 'Superuser')
})