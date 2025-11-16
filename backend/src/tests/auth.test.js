const request = require('supertest');
const app = require('../app');
const db = require('./setup');
const User = require('../models/User');

beforeAll(async () => await db.connect());
afterAll(async () => await db.closeDatabase());
afterEach(async () => await db.clearDatabase());

describe('Auth: register & login', () => {
  test('register returns 201 and token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ name: 'Alice', email: 'alice@example.com' });
    const users = await User.find();
    expect(users.length).toBe(1);
  });

  test('login with correct credentials returns token', async () => {
    await request(app).post('/api/auth/register').send({ name: 'Bob', email: 'bob@example.com', password: 'secret' });
    const res = await request(app).post('/api/auth/login').send({ email: 'bob@example.com', password: 'secret' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('login with wrong password returns 401', async () => {
    await request(app).post('/api/auth/register').send({ name: 'Bob', email: 'bob2@example.com', password: 'secret' });
    const res = await request(app).post('/api/auth/login').send({ email: 'bob2@example.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});
