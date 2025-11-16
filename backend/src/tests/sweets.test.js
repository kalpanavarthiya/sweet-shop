const request = require('supertest');
const app = require('../app');
const db = require('./setup');
const User = require('../models/User');
const Sweet = require('../models/Sweet');
const jwt = require('jsonwebtoken');

let adminToken, userToken;

beforeAll(async () => await db.connect());
afterAll(async () => await db.closeDatabase());
afterEach(async () => await db.clearDatabase());

async function createAdmin() {
  const res = await request(app).post('/api/auth/register').send({ name:'Admin', email:'admin@example.com', password:'adminpass' });
  // make admin
  await User.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' }});
  const user = await User.findOne({ email: 'admin@example.com' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'change_this_secret');
  return token;
}

async function createUser() {
  const res = await request(app).post('/api/auth/register').send({ name:'U', email:'u@example.com', password:'userpass' });
  const user = await User.findOne({ email: 'u@example.com' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'change_this_secret');
  return token;
}

test('admin can create a sweet and users can list and purchase', async () => {
  adminToken = await createAdmin();
  userToken = await createUser();

  const createRes = await request(app).post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Gulab Jamun', category: 'Indian', price: 10, quantity: 5 });
  expect(createRes.statusCode).toBe(201);
  const listRes = await request(app).get('/api/sweets');
  expect(listRes.statusCode).toBe(200);
  expect(Array.isArray(listRes.body)).toBe(true);
  const sweet = listRes.body[0];

  // Purchase 2
  const purchaseRes = await request(app).post(`/api/sweets/${sweet._id}/purchase`)
    .set('Authorization', `Bearer ${userToken}`)
    .send({ qty: 2 });
  expect(purchaseRes.statusCode).toBe(200);
  expect(purchaseRes.body.sweet.quantity).toBe(3);

  // Cannot purchase more than stock
  const badPurchase = await request(app).post(`/api/sweets/${sweet._id}/purchase`)
    .set('Authorization', `Bearer ${userToken}`)
    .send({ qty: 10 });
  expect(badPurchase.statusCode).toBe(400);
});

test('non-admin cannot create sweet', async () => {
  userToken = await createUser();
  const res = await request(app).post('/api/sweets')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ name: 'Ladoo', category: 'Indian', price: 5, quantity: 2 });
  expect(res.statusCode).toBe(403);
});
