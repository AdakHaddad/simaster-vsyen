'use strict';

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue({}),
    connection: { host: 'mock-host', collections: {} },
  };
});

jest.mock('../src/models/User');
jest.mock('../src/models/Course');
jest.mock('../src/models/Session');
jest.mock('../src/models/Attendance');
jest.mock('../src/models/FaceProfile');
jest.mock('../src/services/lmsService', () => ({
  isConfigured: jest.fn().mockReturnValue(false),
  createSession: jest.fn(),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Session = require('../src/models/Session');

const makeToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

const mockAdmin = { _id: 'admin-id', name: 'Admin', email: 'admin@test.com', role: 'admin', isActive: true };
const mockLecturer = { _id: 'lecturer-id', name: 'Lecturer', email: 'lec@test.com', role: 'lecturer', isActive: true };
const mockStudent = { _id: 'student-id', name: 'Student', email: 'stu@test.com', role: 'student', isActive: true };

const mockCourse = {
  _id: 'course-id',
  name: 'CS101',
  code: 'CS101',
  lecturer: mockLecturer._id,
  students: [],
  isActive: true,
};

const mockSession = {
  _id: 'session-id',
  course: mockCourse,
  sessionNumber: 1,
  topic: 'Intro',
  scheduledAt: new Date(Date.now() - 5 * 60 * 1000),
  durationMinutes: 100,
  gracePeriodMinutes: 15,
  status: 'scheduled',
  save: jest.fn().mockResolvedValue(true),
  populate: jest.fn().mockReturnThis(),
};

let app;
let adminToken;
let lecturerToken;
let studentToken;

beforeAll(() => {
  app = require('../server');
  adminToken = makeToken(mockAdmin);
  lecturerToken = makeToken(mockLecturer);
  studentToken = makeToken(mockStudent);
});

afterEach(() => {
  jest.clearAllMocks();
});

// Setup findById mock for auth middleware
const setupAuthMock = () => {
  User.findById = jest.fn().mockImplementation((id) => ({
    select: jest.fn().mockResolvedValue(
      id === mockAdmin._id ? mockAdmin :
      id === mockLecturer._id ? mockLecturer :
      id === mockStudent._id ? mockStudent : null
    ),
  }));
};

describe('Courses API', () => {
  beforeEach(() => {
    setupAuthMock();
  });

  describe('POST /api/courses', () => {
    it('admin can create a course', async () => {
      Course.create = jest.fn().mockResolvedValue({
        ...mockCourse,
        populate: jest.fn().mockResolvedValue(mockCourse),
      });

      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Computing', code: 'CS101', lecturer: 'lecturer-id' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('student cannot create a course (403)', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ name: 'Test', code: 'T101', lecturer: 'lecturer-id' });

      expect(res.status).toBe(403);
    });

    it('unauthenticated request returns 401', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({ name: 'Test', code: 'T101', lecturer: 'lecturer-id' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/courses', () => {
    it('admin can list all courses', async () => {
      Course.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([mockCourse]),
      });

      const res = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.courses).toBeDefined();
    });

    it('unauthenticated returns 401', async () => {
      const res = await request(app).get('/api/courses');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/courses/:id', () => {
    it('returns course details', async () => {
      Course.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        // second .populate()
        then: undefined,
      });

      // Simplify by chaining
      const populateMock = jest.fn().mockReturnThis();
      Course.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(mockCourse),
        })),
      });

      const res = await request(app)
        .get('/api/courses/course-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.course).toBeDefined();
    });

    it('returns 404 for unknown course', async () => {
      Course.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(null),
        })),
      });

      const res = await request(app)
        .get('/api/courses/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/courses/:id/enroll', () => {
    it('admin can enroll a student', async () => {
      const courseMock = {
        ...mockCourse,
        students: [],
        save: jest.fn().mockResolvedValue(true),
        includes: jest.fn().mockReturnValue(false),
      };
      courseMock.students.includes = jest.fn().mockReturnValue(false);
      courseMock.students.push = jest.fn();

      Course.findById = jest.fn().mockResolvedValue(courseMock);

      const res = await request(app)
        .post('/api/courses/course-id/enroll')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ studentId: 'student-id' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('student cannot enroll others (403)', async () => {
      const res = await request(app)
        .post('/api/courses/course-id/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ studentId: 'student-id' });

      expect(res.status).toBe(403);
    });
  });
});

describe('Sessions API', () => {
  beforeEach(() => {
    setupAuthMock();
  });

  describe('POST /api/sessions', () => {
    it('lecturer can create a session (no LMS sync)', async () => {
      const savedSession = { ...mockSession, toObject: () => mockSession };
      Session.create = jest.fn().mockResolvedValue({
        ...savedSession,
        populate: jest.fn().mockResolvedValue(savedSession),
        save: jest.fn().mockResolvedValue(true),
      });

      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${lecturerToken}`)
        .send({
          course: 'course-id',
          sessionNumber: 1,
          topic: 'Intro',
          scheduledAt: new Date().toISOString(),
          syncToLms: false,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('student cannot create a session (403)', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ course: 'course-id', sessionNumber: 1, scheduledAt: new Date().toISOString() });

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/sessions/:id/open', () => {
    it('lecturer can open a scheduled session', async () => {
      const sessionMock = { ...mockSession, status: 'scheduled' };
      Session.findById = jest.fn().mockResolvedValue(sessionMock);

      const res = await request(app)
        .put('/api/sessions/session-id/open')
        .set('Authorization', `Bearer ${lecturerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.session.status).toBe('open');
    });

    it('returns 400 when trying to open a closed session', async () => {
      const sessionMock = { ...mockSession, status: 'closed', save: jest.fn() };
      Session.findById = jest.fn().mockResolvedValue(sessionMock);

      const res = await request(app)
        .put('/api/sessions/session-id/open')
        .set('Authorization', `Bearer ${lecturerToken}`);

      expect(res.status).toBe(400);
    });

    it('returns 404 for unknown session', async () => {
      Session.findById = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .put('/api/sessions/unknown-id/open')
        .set('Authorization', `Bearer ${lecturerToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/sessions/:id/close', () => {
    it('lecturer can close an open session', async () => {
      const sessionMock = { ...mockSession, status: 'open' };
      Session.findById = jest.fn().mockResolvedValue(sessionMock);

      const res = await request(app)
        .put('/api/sessions/session-id/close')
        .set('Authorization', `Bearer ${lecturerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.session.status).toBe('closed');
    });

    it('returns 400 when session is not open', async () => {
      const sessionMock = { ...mockSession, status: 'scheduled', save: jest.fn() };
      Session.findById = jest.fn().mockResolvedValue(sessionMock);

      const res = await request(app)
        .put('/api/sessions/session-id/close')
        .set('Authorization', `Bearer ${lecturerToken}`);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/sessions', () => {
    it('returns sessions list', async () => {
      Session.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([mockSession]),
      });

      const res = await request(app)
        .get('/api/sessions')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sessions).toBeDefined();
    });
  });
});
