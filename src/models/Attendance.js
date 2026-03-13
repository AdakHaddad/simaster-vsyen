'use strict';

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Session is required'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    status: {
      type: String,
      enum: ['present', 'late', 'absent', 'excused'],
      default: 'present',
    },
    capturedAt: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ['cctv', 'manual', 'qr_code'],
      default: 'cctv',
    },
    faceConfidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    cctvCameraId: {
      type: String,
      trim: true,
    },
    faceImageRef: {
      type: String,
      trim: true,
    },
    lmsSynced: {
      type: Boolean,
      default: false,
    },
    lmsSyncedAt: {
      type: Date,
    },
    lmsAttendanceId: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ session: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
