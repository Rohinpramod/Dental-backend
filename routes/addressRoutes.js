import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';

const router = express.Router();

router.post('/add', authMiddleware, addAddress);
router.get('/addresses', getAddresses);
router.get('/:addressId', getAddressById);
router.put('/updateAddress/:addressId', updateAddress);
router.delete('/deleteAddress/:addressId', deleteAddress);

export default router;
