const { describe, before, beforeEach, after, test } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = require('../app'); // Assuming your Express app is exported from app.js
const User = require('../models/user'); // Assuming you have a User model defined
const api = supertest(app);
const config = require('../utils/config'); // Assuming you have a config file for DB URI

describe('Login API Tests', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URI);
  });

    beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('securepassword', 10);
    const user = new User({ username: 'testuser', name: 'superuser', passwordHash });
    await user.save();
  } );

  test('Successful login returns a token', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'securepassword' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.ok(response.body.token);
    assert.strictEqual(response.body.username, 'testuser');
    assert.strictEqual(response.body.name, 'superuser');
    assert.ok(response.body.token.split('.').length >= 2);
    });

    test('Login fails with incorrect password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/);
      
    assert.strictEqual(response.body.error, 'invalid username or password');
    });

    test('Login fails with non-existent username', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'nonexistent', password: 'somepassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.error, 'invalid username or password');
    });

    test( 'fails with 400 when username or password is missing', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testuser' }) // Missing password
      .expect(400)
      .expect('Content-Type', /application\/json/);
      
    assert.strictEqual(response.body.error, 'username and password are required');
  
    const response2 = await api
      .post('/api/login')
      .send({ password: 'securepassword' }) // Missing username
      .expect(400)
      .expect('Content-Type', /application\/json/);
      
    assert.strictEqual(response2.body.error, 'username and password are required');
    
  
  });

  after(async () => {
    await mongoose.connection.close();
  });
});