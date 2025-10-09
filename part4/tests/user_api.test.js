const { test, before, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const config = require('../utils/config')
const User = require('../models/user')
const helper = require('./test_helper')


describe('when there is initially one user in db', () => {
before(async () => {
  await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })

  await user.save()
})

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.equal(response.body.passwordHash, undefined)
        assert.equal(response.body.username, newUser.username)
        assert.ok(response.body.id)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert.ok(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const newUser = {
            username: 'root',
            name: 'Duplicate User',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert.match(result.body.error || '', /duplicate key/i);        
        
        const usersAtEnd = await helper.usersInDb()
        const roots = usersAtEnd.filter(u => u.username === 'root')
        assert.strictEqual(roots.length, 1)
        })

    test('creation fails if username is shorter than 3 chars', async () => {
      const newUser = {
          username: 'ro',
          name: 'Short Username',
          password: 'salainen',
      }

      const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

    assert.match(result.body.error || '', /minlength|short|validation/i)  
  })

    test('creation fails if password is shorter than 3 chars', async () => {
      const newUser = {
          username: 'validusername',
          name: 'Short Password',
          password: 'sa',
      }

      const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

    assert.match(result.body.error || '', /password.*(missing|short|too short)/i)    
  })

  test('users are returned as json and include the seeded user', async () => {
    const res = await api.get('/api/users').expect(200).expect('Content-Type', /json/);
    const usernames = res.body.map(u => u.username);
    assert.ok(usernames.includes('root'));
  });
after(async () => {
  await mongoose.connection.close()
})

})
