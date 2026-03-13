'use strict';

const express = require('express');
const {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  enrollStudent,
  unenrollStudent,
} = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', listCourses);
router.get('/:id', getCourse);
router.post('/', authorize('admin'), createCourse);
router.put('/:id', authorize('admin', 'lecturer'), updateCourse);
router.post('/:id/enroll', authorize('admin'), enrollStudent);
router.delete('/:id/enroll/:studentId', authorize('admin'), unenrollStudent);

module.exports = router;
