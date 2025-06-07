import express from 'express';
import {
  signup,
  login,
  getProfile,
  resetPassword,
  logout,
  profileUpdate,
  checkUser,
  deleteUserAccount,
  getUsers,
  forgotPassword
} from '../controllers/authControllers.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
// router.post('/otp-verify', verifyOTP); 

router.post('/login', login);

router.get('/profile', authMiddleware, getProfile);
router.post('/forget-password',forgotPassword)
router.put('/reset-password/:token', resetPassword);

router.put('/logout', logout);
router.put('/update-Profile', authMiddleware, profileUpdate);
router.delete('/delete-account', authMiddleware, deleteUserAccount);

router.get('/check-user', authMiddleware, checkUser);

router.get('/get-users', getUsers);

export default router;
