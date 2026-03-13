'use strict';

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    sessionNumber: {
      type: Number,
      required: [true, 'Session number is required'],
    },
    topic: {
      type: String,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date/time is required'],
    },
    durationMinutes: {
      type: Number,
      default: 100,
    },
    room: {
      type: String,
      trim: true,
    },
    cctvCameraId: {
      type: String,
      trim: true,
    },
    lmsSessionId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'open', 'closed'],
      default: 'scheduled',
    },
    openedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
    gracePeriodMinutes: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  }
);

sessionSchema.virtual('isOpen').get(function () {
  return this.status === 'open';
});

sessionSchema.virtual('endsAt').get(function () {
  if (!this.scheduledAt) return null;
  return new Date(this.scheduledAt.getTime() + this.durationMinutes * 60 * 1000);
});

module.exports = mongoose.model('Session', sessionSchema);
