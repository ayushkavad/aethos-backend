const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./../app');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config({ path: './test.config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const userOneId = new mongoose.Types.ObjectId();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(DB);
});

mongoose.set('strictQuery', false);

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe('GET /api/v1/courses', () => {
  it('Get all courses', async () => {
    const response = await request(app).get('/api/v1/courses');
    expect(response.statusCode).toBe(200);
  });

  it('Get a course', async () => {
    const response = await request(app).get(
      '/api/v1/courses/64280033e5067e174689d782'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.data.data.id).toEqual('64280033e5067e174689d782');
  });
});
