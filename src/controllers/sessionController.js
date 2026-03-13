'use strict';

const Session = require('../models/Session');
const Course = require('../models/Course');
const lmsService = require('../services/lmsService');

/**
 * GET /api/sessions
 * List sessions (filtered by course if ?courseId= is provided)
 */
const listSessions = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.courseId) query.course = req.query.courseId;
    if (req.query.status) query.status = req.query.status;

    const sessions = await Session.find(query)
      .populate('course', 'name code')
      .sort({ scheduledAt: -1 });

    res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sessions/:id
 * Get a single session by ID
 */
const getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id).populate('course', 'name code lecturer');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/sessions
 * Create a new session (admin or lecturer)
 */
const createSession = async (req, res, next) => {
  try {
    const session = await Session.create(req.body);

    // Optionally create the session in LMS if the course has an LMS ID
    if (req.body.syncToLms !== false) {
      const course = await Course.findById(session.course);
      if (course && course.lmsCourseId && lmsService.isConfigured()) {
        try {
          const { lmsSessionId } = await lmsService.createSession(course.lmsCourseId, {
            topic: session.topic,
            session_number: session.sessionNumber,
            scheduled_at: session.scheduledAt,
            duration_minutes: session.durationMinutes,
            room: session.room,
          });
          session.lmsSessionId = lmsSessionId;
          await session.save();
        } catch (lmsErr) {
          console.warn('LMS session creation failed (non-fatal):', lmsErr.message);
        }
      }
    }

    await session.populate('course', 'name code');
    res.status(201).json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/sessions/:id/open
 * Open a session for attendance (admin or lecturer)
 */
const openSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.status === 'closed') {
      return res.status(400).json({ success: false, message: 'Cannot reopen a closed session' });
    }

    session.status = 'open';
    session.openedAt = new Date();
    await session.save();

    res.json({ success: true, message: 'Session opened for attendance', session });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/sessions/:id/close
 * Close a session (admin or lecturer)
 */
const closeSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Session is not currently open' });
    }

    session.status = 'closed';
    session.closedAt = new Date();
    await session.save();

    res.json({ success: true, message: 'Session closed', session });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/sessions/:id
 * Update session metadata (admin or lecturer)
 */
const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('course', 'name code');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

module.exports = { listSessions, getSession, createSession, openSession, closeSession, updateSession };
