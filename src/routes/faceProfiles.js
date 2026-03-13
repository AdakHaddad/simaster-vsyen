'use strict';

const express = require('express');
const multer = require('multer');
const {
  registerFace,
  getFaceProfile,
  deleteFaceProfile,
} = require('../controllers/faceProfileController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.use(authenticate);

// Register or update face profile
router.post('/', upload.single('image'), registerFace);

// Get face profile (admin: any user; student: own profile)
router.get('/:userId', getFaceProfile);

// Delete face profile (admin only)
router.delete('/:userId', authorize('admin'), deleteFaceProfile);

module.exports = router;
