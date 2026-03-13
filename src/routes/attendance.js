'use strict';

const express = require('express');
const multer = require('multer');
const {
  captureFromCctv,
  recordManual,
  listAttendance,
  getCourseSummary,
  syncToLms,
} = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Store uploads in memory for processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.use(authenticate);

// CCTV face-recognition attendance capture
router.post('/cctv', upload.single('image'), captureFromCctv);

// Manual attendance recording (admin or lecturer)
router.post('/manual', authorize('admin', 'lecturer'), recordManual);

// Sync unsynced records to LMS (admin or lecturer)
router.post('/sync-lms', authorize('admin', 'lecturer'), syncToLms);

// List attendance records
router.get('/', listAttendance);

// Attendance summary for a course
router.get('/summary/:courseId', authorize('admin', 'lecturer'), getCourseSummary);

module.exports = router;
