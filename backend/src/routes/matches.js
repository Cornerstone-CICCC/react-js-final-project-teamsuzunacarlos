import express from 'express';
import {
  getUserMatches,
  createMatch,
  acceptMatch,
  rejectMatch,
  unmatch,
} from '../controllers/matchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUserMatches);
router.post('/', protect, createMatch);
router.put('/:id/accept', protect, acceptMatch);
router.put('/:id/reject', protect, rejectMatch);
router.delete('/:id', protect, unmatch);

export default router;
