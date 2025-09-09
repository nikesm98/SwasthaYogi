/**
 * @jest-environment node
 */
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';

const testUser = {
  email: 'jestuser@example.com',
  password: 'jestpass123',
  name: 'Jest User'
};

describe('Auth API', () => {
  afterAll(async () => {
    await mongoose.connection.db.collection('users').deleteMany({ email: testUser.email });
    await mongoose.disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registered/i);
  });

  it('should not register duplicate user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);
    expect(res.statusCode).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: 'wrongpass' });
    expect(res.statusCode).toBe(400);
  });
});