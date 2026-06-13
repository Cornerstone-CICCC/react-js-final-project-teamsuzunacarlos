import express from 'express';
import {
  getAllSocks,
  getSockById,
  createSock,
  updateSock,
  deleteSock,
  getUserSocks,
} from '../controllers/sockController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../services/imageService.js';

const router = express.Router();

router.get('/', optionalAuth, getAllSocks);
router.get('/my-socks', protect, getUserSocks);
router.get('/:id', getSockById);
router.post('/', protect, upload.array('images'), createSock);
router.put('/:id', protect, upload.array('images'), updateSock);
router.delete('/:id', protect, deleteSock);

export default router;
