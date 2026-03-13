'use strict';

const mongoose = require('mongoose');

const faceProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    faceDescriptors: [
      {
        type: [Number],
        required: true,
      },
    ],
    externalFaceId: {
      type: String,
      trim: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FaceProfile', faceProfileSchema);
