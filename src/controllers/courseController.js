'use strict';

const Course = require('../models/Course');

/**
 * GET /api/courses
 * List courses (admin/lecturer sees all; students see enrolled courses)
 */
const listCourses = async (req, res, next) => {
  try {
    let query = { isActive: true };

    if (req.user.role === 'student') {
      query.students = req.user._id;
    } else if (req.user.role === 'lecturer') {
      query.lecturer = req.user._id;
    }

    const courses = await Course.find(query)
      .populate('lecturer', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses/:id
 * Get a single course by ID
 */
const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lecturer', 'name email')
      .populate('students', 'name email studentId');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/courses
 * Create a new course (admin only)
 */
const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    await course.populate('lecturer', 'name email');
    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/courses/:id
 * Update a course (admin or assigned lecturer)
 */
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('lecturer', 'name email');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/courses/:id/enroll
 * Enroll a student in a course (admin only)
 */
const enrollStudent = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.students.includes(studentId)) {
      return res.status(409).json({ success: false, message: 'Student already enrolled' });
    }

    course.students.push(studentId);
    await course.save();

    res.json({ success: true, message: 'Student enrolled successfully', course });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/courses/:id/enroll/:studentId
 * Remove a student from a course (admin only)
 */
const unenrollStudent = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.students = course.students.filter(
      (s) => s.toString() !== req.params.studentId
    );
    await course.save();

    res.json({ success: true, message: 'Student unenrolled successfully', course });
  } catch (error) {
    next(error);
  }
};

module.exports = { listCourses, getCourse, createCourse, updateCourse, enrollStudent, unenrollStudent };
