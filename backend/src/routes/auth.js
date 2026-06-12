import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateSignup, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);

export default router;
