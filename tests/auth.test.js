'use strict';

// Mock mongoose to avoid needing a real DB
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      host: 'mock-host',
      collections: {},
    },
  };
});

// Mock all models
jest.mock('../src/models/User');
jest.mock('../src/models/Course');
jest.mock('../src/models/Session');
jest.mock('../src/models/Attendance');
jest.mock('../src/models/FaceProfile');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

const User = require('../src/models/User');

// Helper to create a valid JWT token
const makeToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

const mockAdmin = {
  _id: 'admin-id-001',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'admin',
  isActive: true,
};

const mockStudent = {
  _id: 'student-id-001',
  name: 'Student One',
  email: 'student@test.com',
  role: 'student',
  studentId: 'STU001',
  isActive: true,
};

let app;

beforeAll(() => {
  app = require('../server');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      User.create = jest.fn().mockResolvedValue({
        ...mockAdmin,
        toJSON: () => mockAdmin,
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should return 409 on duplicate email (Mongoose code 11000)', async () => {
      const err = new Error('Duplicate key');
      err.code = 11000;
      err.keyPattern = { email: 1 };
      User.create = jest.fn().mockRejectedValue(err);

      const res = await request(app).post('/api/auth/register').send({
        name: 'User',
        email: 'dup@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const hashedPw = await bcrypt.hash('password123', 12);
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          ...mockAdmin,
          password: hashedPw,
          comparePassword: jest.fn().mockResolvedValue(true),
        }),
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          ...mockAdmin,
          comparePassword: jest.fn().mockResolvedValue(false),
        }),
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@test.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });

    it('should return 400 when email or password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com' });
      expect(res.status).toBe(400);
    });

    it('should reject non-existent user', async () => {
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'noone@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user when authenticated', async () => {
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAdmin),
      });

      const token = makeToken(mockAdmin);
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('admin@test.com');
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });
  });
});

describe('Health Check', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('404 Handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
