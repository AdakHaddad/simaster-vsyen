'use strict';

const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const FaceProfile = require('../models/FaceProfile');
const User = require('../models/User');
const faceRecognitionService = require('../services/faceRecognitionService');
const lmsService = require('../services/lmsService');

/**
 * Determine attendance status based on when the student arrived relative
 * to the session schedule and grace period.
 */
const determineStatus = (session, capturedAt) => {
  const deadline = new Date(
    session.scheduledAt.getTime() + session.gracePeriodMinutes * 60 * 1000
  );
  return capturedAt <= deadline ? 'present' : 'late';
};

/**
 * POST /api/attendance/cctv
 * Process a CCTV image frame, identify the student via face recognition,
 * and automatically record their attendance for an open session.
 *
 * Body (multipart/form-data):
 *   - image: image file from CCTV
 *   - sessionId: the open session ID
 *   - cctvCameraId: optional camera identifier
 */
const captureFromCctv = async (req, res, next) => {
  try {
    const { sessionId, cctvCameraId } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    // 1. Verify session is open
    const session = await Session.findById(sessionId).populate('course');
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    if (session.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Session is not open for attendance' });
    }

    // 2. Identify face from the CCTV image
    let identifyResult;
    try {
      identifyResult = await faceRecognitionService.identifyFromImage(
        req.file.buffer,
        req.file.mimetype
      );
    } catch (faceErr) {
      return res.status(503).json({
        success: false,
        message: 'Face recognition service unavailable',
        detail: faceErr.message,
      });
    }

    if (!identifyResult) {
      return res.status(422).json({
        success: false,
        message: 'Face not recognized or confidence below threshold',
      });
    }

    // 3. Look up the internal user by their external face ID
    const faceProfile = await FaceProfile.findOne({
      externalFaceId: identifyResult.externalFaceId,
    });

    if (!faceProfile) {
      return res.status(404).json({
        success: false,
        message: 'No registered student found for the identified face',
      });
    }

    const student = await User.findById(faceProfile.user);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Identified user is not a student' });
    }

    // 4. Record attendance (upsert to avoid duplicates)
    const capturedAt = new Date();
    const status = determineStatus(session, capturedAt);

    const attendance = await Attendance.findOneAndUpdate(
      { session: sessionId, student: student._id },
      {
        $setOnInsert: {
          session: sessionId,
          student: student._id,
          course: session.course._id,
          method: 'cctv',
          faceImageRef: req.file.originalname,
          faceConfidence: identifyResult.confidence,
          cctvCameraId: cctvCameraId || session.cctvCameraId,
          capturedAt,
          status,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const isNew = attendance.createdAt.getTime() === attendance.updatedAt.getTime();

    // 5. Async LMS sync (non-blocking)
    if (isNew && session.course.lmsCourseId && session.lmsSessionId && student.lmsUserId && lmsService.isConfigured()) {
      setImmediate(async () => {
        try {
          const { lmsAttendanceId } = await lmsService.recordAttendance(
            session.lmsSessionId,
            student.lmsUserId,
            attendance.status,
            capturedAt
          );
          await Attendance.findByIdAndUpdate(attendance._id, {
            lmsSynced: true,
            lmsSyncedAt: new Date(),
            lmsAttendanceId,
          });
        } catch (lmsErr) {
          console.warn('LMS attendance sync failed (non-fatal):', lmsErr.message);
        }
      });
    }

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew
        ? `Attendance recorded for ${student.name}`
        : `Attendance already recorded for ${student.name}`,
      attendance: {
        id: attendance._id,
        student: { id: student._id, name: student.name, studentId: student.studentId },
        status: attendance.status,
        capturedAt: attendance.capturedAt,
        faceConfidence: identifyResult.confidence,
        method: attendance.method,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/attendance/manual
 * Manually record or override attendance for a student (admin or lecturer).
 *
 * Body:
 *   - sessionId
 *   - studentId
 *   - status: 'present' | 'late' | 'absent' | 'excused'
 *   - notes: optional
 */
const recordManual = async (req, res, next) => {
  try {
    const { sessionId, studentId, status, notes } = req.body;

    const session = await Session.findById(sessionId).populate('course');
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { session: sessionId, student: studentId },
      {
        session: sessionId,
        student: studentId,
        course: session.course._id,
        status: status || 'present',
        method: 'manual',
        capturedAt: new Date(),
        notes,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attendance
 * List attendance records with optional filters:
 *   - sessionId, studentId, courseId, status
 */
const listAttendance = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.sessionId) filter.session = req.query.sessionId;
    if (req.query.studentId) filter.student = req.query.studentId;
    if (req.query.courseId) filter.course = req.query.courseId;
    if (req.query.status) filter.status = req.query.status;

    // Students can only view their own attendance
    if (req.user.role === 'student') {
      filter.student = req.user._id;
    }

    const records = await Attendance.find(filter)
      .populate('student', 'name email studentId')
      .populate('session', 'sessionNumber topic scheduledAt')
      .populate('course', 'name code')
      .sort({ capturedAt: -1 });

    res.json({ success: true, count: records.length, attendance: records });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attendance/summary/:courseId
 * Get attendance summary for all students in a course.
 * Shows percentage attendance per student.
 */
const getCourseSummary = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const summary = await Attendance.aggregate([
      { $match: { course: require('mongoose').Types.ObjectId.createFromHexString(courseId) } },
      {
        $group: {
          _id: '$student',
          totalSessions: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
          excused: { $sum: { $cond: [{ $eq: ['$status', 'excused'] }, 1, 0] } },
        },
      },
      {
        $addFields: {
          attendanceRate: {
            $multiply: [
              {
                $divide: [
                  { $add: ['$present', '$late'] },
                  { $max: ['$totalSessions', 1] },
                ],
              },
              100,
            ],
          },
        },
      },
      { $sort: { attendanceRate: -1 } },
    ]);

    // Populate student info
    const User = require('../models/User');
    const populated = await User.populate(summary, {
      path: '_id',
      select: 'name email studentId',
    });

    res.json({ success: true, courseId, count: populated.length, summary: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/attendance/sync-lms
 * Manually trigger LMS sync for unsynced attendance records in a session.
 * Body: { sessionId }
 */
const syncToLms = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (!lmsService.isConfigured()) {
      return res.status(503).json({ success: false, message: 'LMS service is not configured' });
    }

    const session = await Session.findById(sessionId).populate('course');
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (!session.lmsSessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session does not have an LMS session ID',
      });
    }

    // Fetch unsynced attendance records for this session
    const unsynced = await Attendance.find({ session: sessionId, lmsSynced: false })
      .populate('student', 'lmsUserId name');

    const records = unsynced
      .filter((a) => a.student && a.student.lmsUserId)
      .map((a) => ({
        attendanceId: a._id,
        lmsUserId: a.student.lmsUserId,
        status: a.status,
        capturedAt: a.capturedAt,
      }));

    const { synced, failed, results } = await lmsService.syncBatchAttendance(
      session.lmsSessionId,
      records
    );

    // Update synced records in DB
    const syncedIds = results
      .filter((r) => r.success)
      .map((r) => r.attendanceId);

    if (syncedIds.length > 0) {
      await Attendance.updateMany(
        { _id: { $in: syncedIds } },
        { lmsSynced: true, lmsSyncedAt: new Date() }
      );
    }

    res.json({
      success: true,
      synced,
      failed,
      total: records.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { captureFromCctv, recordManual, listAttendance, getCourseSummary, syncToLms };
