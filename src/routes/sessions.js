'use strict';

const express = require('express');
const {
  listSessions,
  getSession,
  createSession,
  openSession,
  closeSession,
  updateSession,
} = require('../controllers/sessionController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', listSessions);
router.get('/:id', getSession);
router.post('/', authorize('admin', 'lecturer'), createSession);
router.put('/:id', authorize('admin', 'lecturer'), updateSession);
router.put('/:id/open', authorize('admin', 'lecturer'), openSession);
router.put('/:id/close', authorize('admin', 'lecturer'), closeSession);

module.exports = router;
