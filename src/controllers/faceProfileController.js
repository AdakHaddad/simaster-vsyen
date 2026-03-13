'use strict';

const FaceProfile = require('../models/FaceProfile');
const User = require('../models/User');
const faceRecognitionService = require('../services/faceRecognitionService');

/**
 * POST /api/face-profiles
 * Register a face profile for a user.
 * Accepts an image upload and registers it with the face recognition service.
 *
 * Body (multipart/form-data):
 *   - image: face image file
 *   - userId: the user to register (admin only; defaults to req.user for students)
 */
const registerFace = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const targetUserId =
      req.user.role === 'admin' && req.body.userId ? req.body.userId : req.user._id;

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Register face with external service
    let externalFaceId;
    try {
      const result = await faceRecognitionService.registerFace(
        targetUserId.toString(),
        req.file.buffer,
        req.file.mimetype
      );
      externalFaceId = result.externalFaceId;
    } catch (faceErr) {
      return res.status(503).json({
        success: false,
        message: 'Face recognition service unavailable',
        detail: faceErr.message,
      });
    }

    const profile = await FaceProfile.findOneAndUpdate(
      { user: targetUserId },
      {
        user: targetUserId,
        externalFaceId,
        lastUpdatedAt: new Date(),
        isVerified: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, message: 'Face profile registered successfully', profile });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/face-profiles/:userId
 * Get a user's face profile (admin or the user themselves)
 */
const getFaceProfile = async (req, res, next) => {
  try {
    const targetUserId =
      req.user.role === 'admin' ? req.params.userId : req.user._id;

    const profile = await FaceProfile.findOne({ user: targetUserId }).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Face profile not found' });
    }

    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/face-profiles/:userId
 * Delete a face profile (admin only)
 */
const deleteFaceProfile = async (req, res, next) => {
  try {
    const profile = await FaceProfile.findOne({ user: req.params.userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Face profile not found' });
    }

    if (profile.externalFaceId && faceRecognitionService.apiUrl) {
      try {
        await faceRecognitionService.deleteFace(profile.externalFaceId);
      } catch {
        // Log but continue with local deletion
        console.warn('Could not delete face from external service');
      }
    }

    await profile.deleteOne();
    res.json({ success: true, message: 'Face profile deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerFace, getFaceProfile, deleteFaceProfile };
