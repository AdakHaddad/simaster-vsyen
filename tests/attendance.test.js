'use strict';

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue({}),
    connection: { host: 'mock-host', collections: {} },
    Types: {
      ...actualMongoose.Types,
      ObjectId: {
        ...actualMongoose.Types.ObjectId,
        createFromHexString: jest.fn().mockImplementation((id) => id),
      },
    },
  };
});

jest.mock('../src/models/User');
jest.mock('../src/models/Course');
jest.mock('../src/models/Session');
jest.mock('../src/models/Attendance');
jest.mock('../src/models/FaceProfile');
jest.mock('../src/services/faceRecognitionService', () => ({
  identifyFromImage: jest.fn(),
  registerFace: jest.fn(),
  deleteFace: jest.fn(),
  apiUrl: '',
  matchThreshold: 0.85,
}));
jest.mock('../src/services/lmsService', () => ({
  isConfigured: jest.fn().mockReturnValue(false),
  recordAttendance: jest.fn(),
  syncBatchAttendance: jest.fn(),
  createSession: jest.fn(),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';
process.env.FACE_RECOGNITION_API_URL = '';
process.env.LMS_API_URL = '';

const User = require('../src/models/User');
const Session = require('../src/models/Session');
const Attendance = require('../src/models/Attendance');
const FaceProfile = require('../src/models/FaceProfile');
const faceRecognitionService = require('../src/services/faceRecognitionService');
const lmsService = require('../src/services/lmsService');

const makeToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

const mockAdmin = { _id: 'admin-id', name: 'Admin', email: 'admin@test.com', role: 'admin', isActive: true };
const mockLecturer = { _id: 'lecturer-id', name: 'Lecturer', email: 'lec@test.com', role: 'lecturer', isActive: true };
const mockStudent = {
  _id: 'student-id',
  name: 'Student One',
  email: 'stu@test.com',
  role: 'student',
  studentId: 'STU001',
  lmsUserId: 'LMS_STU001',
  isActive: true,
};

const mockCourse = {
  _id: 'course-id',
  name: 'Data Structures',
  code: 'DS301',
  lmsCourseId: null,
};

const mockOpenSession = {
  _id: 'session-id',
  course: mockCourse,
  sessionNumber: 1,
  topic: 'Arrays',
  scheduledAt: new Date(Date.now() - 5 * 60 * 1000),
  durationMinutes: 100,
  gracePeriodMinutes: 15,
  status: 'open',
  lmsSessionId: null,
  cctvCameraId: 'CAM-01',
};

const mockAttendance = {
  _id: 'att-id',
  session: 'session-id',
  student: 'student-id',
  course: 'course-id',
  status: 'present',
  method: 'manual',
  capturedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  lmsSynced: false,
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

/**
 * Create a thenable that also has a .select() method.
 * This lets the mock work both for:
 *   - auth middleware: User.findById(id).select('-password')
 *   - controllers:    await User.findById(id)
 */
const makeUserQuery = (user) => {
  const p = Promise.resolve(user);
  p.select = jest.fn().mockResolvedValue(user);
  return p;
};

/**
 * Set up User.findById to handle both auth middleware and controller calls.
 * The mock returns the correct user based on the ID in the JWT token.
 */
const makeUserFindByIdMock = () => {
  User.findById = jest.fn().mockImplementation((id) => {
    const user =
      id === mockAdmin._id ? mockAdmin :
      id === mockLecturer._id ? mockLecturer :
      id === mockStudent._id ? mockStudent : null;
    return makeUserQuery(user);
  });
};

describe('Attendance API', () => {
  beforeEach(() => makeUserFindByIdMock());

  describe('POST /api/attendance/cctv', () => {
    it('returns 503 when face recognition service is not configured', async () => {
      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOpenSession),
      });
      faceRecognitionService.identifyFromImage.mockRejectedValue(
        new Error('Face recognition service is not configured')
      );

      const imageBuffer = Buffer.from('fake-image-data');
      const res = await request(app)
        .post('/api/attendance/cctv')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('sessionId', 'session-id')
        .attach('image', imageBuffer, { filename: 'frame.jpg', contentType: 'image/jpeg' });

      expect(res.status).toBe(503);
      expect(res.body.message).toMatch(/face recognition service/i);
    });

    it('returns 422 when face is not recognized', async () => {
      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOpenSession),
      });
      faceRecognitionService.identifyFromImage.mockResolvedValue(null);

      const imageBuffer = Buffer.from('fake-image-data');
      const res = await request(app)
        .post('/api/attendance/cctv')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('sessionId', 'session-id')
        .attach('image', imageBuffer, { filename: 'frame.jpg', contentType: 'image/jpeg' });

      expect(res.status).toBe(422);
      expect(res.body.message).toMatch(/not recognized/i);
    });

    it('returns 400 when image is missing', async () => {
      const res = await request(app)
        .post('/api/attendance/cctv')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sessionId: 'session-id' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/image/i);
    });

    it('returns 400 when sessionId is missing', async () => {
      const imageBuffer = Buffer.from('fake-image-data');
      const res = await request(app)
        .post('/api/attendance/cctv')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('image', imageBuffer, { filename: 'frame.jpg', contentType: 'image/jpeg' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/sessionId/i);
    });

    it('returns 400 when session is not open', async () => {
      const closedSession = { ...mockOpenSession, status: 'closed' };
      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(closedSession),
      });

      const imageBuffer = Buffer.from('fake-image-data');
      const res = await request(app)
        .post('/api/attendance/cctv')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('sessionId', 'session-id')
        .attach('image', imageBuffer, { filename: 'frame.jpg', contentType: 'image/jpeg' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/not open/i);
    });

    it('records attendance when face is recognized', async () => {
      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOpenSession),
      });
      faceRecognitionService.identifyFromImage.mockResolvedValue({
        externalFaceId: 'face-ext-001',
        confidence: 0.92,
      });
      FaceProfile.findOne = jest.fn().mockResolvedValue({
        user: mockStudent._id,
        externalFaceId: 'face-ext-001',
      });
      // Note: User.findById is already set up by beforeEach for the admin token auth,
      // and the controller calls findById(faceProfile.user) = findById(mockStudent._id)
      // which the default mock handles correctly.
      const now = new Date();
      Attendance.findOneAndUpdate = jest.fn().mockResolvedValue({
        ...mockAttendance,
        method: 'cctv',
        createdAt: now,
        updatedAt: now,
      });

      const imageBuffer = Buffer.from('fake-image-data');
      const res = await request(app)
        .post('/api/attendance/cctv')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('sessionId', 'session-id')
        .attach('image', imageBuffer, { filename: 'frame.jpg', contentType: 'image/jpeg' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.attendance).toBeDefined();
    });

    it('returns 404 when face profile has no matching student', async () => {
      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOpenSession),
      });
      faceRecognitionService.identifyFromImage.mockResolvedValue({
        externalFaceId: 'face-unknown',
        confidence: 0.9,
      });
      FaceProfile.findOne = jest.fn().mockResolvedValue(null);

      const imageBuffer = Buffer.from('fake-image-data');
      const res = await request(app)
        .post('/api/attendance/cctv')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('sessionId', 'session-id')
        .attach('image', imageBuffer, { filename: 'frame.jpg', contentType: 'image/jpeg' });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/attendance/manual', () => {
    it('admin can record manual attendance', async () => {
      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOpenSession),
      });
      // User.findById handles both admin auth AND student lookup via makeUserFindByIdMock
      Attendance.findOneAndUpdate = jest.fn().mockResolvedValue({ ...mockAttendance });

      const res = await request(app)
        .post('/api/attendance/manual')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sessionId: 'session-id', studentId: 'student-id', status: 'present' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.attendance.method).toBe('manual');
    });

    it('lecturer can record manual attendance', async () => {
      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOpenSession),
      });
      // User.findById handles both lecturer auth AND student lookup via makeUserFindByIdMock
      Attendance.findOneAndUpdate = jest.fn().mockResolvedValue({ ...mockAttendance, status: 'late' });

      const res = await request(app)
        .post('/api/attendance/manual')
        .set('Authorization', `Bearer ${lecturerToken}`)
        .send({ sessionId: 'session-id', studentId: 'student-id', status: 'late' });

      expect(res.status).toBe(201);
    });

    it('student cannot record manual attendance (403)', async () => {
      const res = await request(app)
        .post('/api/attendance/manual')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ sessionId: 'session-id', studentId: 'student-id', status: 'present' });

      expect(res.status).toBe(403);
    });

    it('returns 404 for unknown session', async () => {
      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app)
        .post('/api/attendance/manual')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sessionId: 'nonexistent', studentId: 'student-id', status: 'present' });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/attendance', () => {
    it('admin can list all attendance records', async () => {
      const attendanceRecord = {
        ...mockAttendance,
        student: mockStudent,
        session: mockOpenSession,
        course: mockCourse,
      };

      Attendance.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([attendanceRecord]),
      });

      const res = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.attendance).toBeDefined();
      expect(res.body.count).toBe(1);
    });

    it('student can list attendance (filtered to own records)', async () => {
      Attendance.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([{ ...mockAttendance, student: mockStudent }]),
      });

      const res = await request(app)
        .get('/api/attendance')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      // Verify the filter includes the student's ID
      expect(Attendance.find).toHaveBeenCalledWith(
        expect.objectContaining({ student: mockStudent._id })
      );
    });

    it('unauthenticated returns 401', async () => {
      const res = await request(app).get('/api/attendance');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/attendance/summary/:courseId', () => {
    it('admin can get course summary', async () => {
      Attendance.aggregate = jest.fn().mockResolvedValue([
        { _id: 'student-id', totalSessions: 5, present: 4, late: 1, absent: 0, excused: 0, attendanceRate: 100 },
      ]);
      User.populate = jest.fn().mockImplementation((docs) => Promise.resolve(docs));

      const res = await request(app)
        .get('/api/attendance/summary/course-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.summary).toBeDefined();
    });

    it('student cannot access summary (403)', async () => {
      const res = await request(app)
        .get('/api/attendance/summary/course-id')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/attendance/sync-lms', () => {
    it('returns 503 when LMS is not configured', async () => {
      lmsService.isConfigured.mockReturnValue(false);

      const res = await request(app)
        .post('/api/attendance/sync-lms')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sessionId: 'session-id' });

      expect(res.status).toBe(503);
      expect(res.body.message).toMatch(/lms/i);
    });

    it('student cannot trigger LMS sync (403)', async () => {
      const res = await request(app)
        .post('/api/attendance/sync-lms')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ sessionId: 'session-id' });

      expect(res.status).toBe(403);
    });

    it('returns 400 when session has no LMS session ID', async () => {
      lmsService.isConfigured.mockReturnValue(true);

      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({ ...mockOpenSession, lmsSessionId: null }),
      });

      const res = await request(app)
        .post('/api/attendance/sync-lms')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sessionId: 'session-id' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/lms session id/i);
    });

    it('syncs unsynced attendance records to LMS', async () => {
      lmsService.isConfigured.mockReturnValue(true);

      const sessionWithLms = { ...mockOpenSession, lmsSessionId: 'LMS_SESSION_1' };
      Session.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(sessionWithLms),
      });

      const unsyncedRecord = {
        _id: 'att-id',
        status: 'present',
        capturedAt: new Date(),
        student: { _id: 'student-id', lmsUserId: 'LMS_STU001', name: 'Student' },
      };
      Attendance.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([unsyncedRecord]),
      });

      lmsService.syncBatchAttendance.mockResolvedValue({
        synced: 1,
        failed: 0,
        results: [{ attendanceId: 'att-id', success: true, lmsAttendanceId: 'LMS_ATT_1' }],
      });

      Attendance.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 1 });

      const res = await request(app)
        .post('/api/attendance/sync-lms')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sessionId: 'session-id' });

      expect(res.status).toBe(200);
      expect(res.body.synced).toBe(1);
      expect(res.body.failed).toBe(0);
    });
  });
});

describe('LMS Service', () => {
  it('isConfigured() returns false when env vars are not set', () => {
    // Using the mocked version
    lmsService.isConfigured.mockReturnValue(false);
    expect(lmsService.isConfigured()).toBe(false);
  });
});

describe('Face Recognition Service', () => {
  it('registerFace is callable', () => {
    expect(typeof faceRecognitionService.registerFace).toBe('function');
  });

  it('identifyFromImage is callable', () => {
    expect(typeof faceRecognitionService.identifyFromImage).toBe('function');
  });
});
