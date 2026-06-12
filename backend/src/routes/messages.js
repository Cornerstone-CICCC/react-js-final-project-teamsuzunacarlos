import express from 'express';
import {
  getConversation,
  getAllConversations,
  sendMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', protect, getAllConversations);
router.get('/:matchId', protect, getConversation);
router.post('/', protect, sendMessage);

export default router;
