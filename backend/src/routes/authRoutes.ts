import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Register a new user
router.post('/register', registerUser);

// Log in an existing user
router.post('/login', loginUser);

// Get the profile of the logged-in user
router.get('/profile', authenticate, getUserProfile);

export default router;
