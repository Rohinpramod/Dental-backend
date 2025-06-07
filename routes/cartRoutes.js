import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import {
  getCart,
  addToCart,
  addQuantity,
  deleteCartItem
} from '../controllers/cartControllers.js';

const router = express.Router();

router.get('/get-cart-items', authMiddleware, getCart);
router.post('/add-to-cart', authMiddleware, addToCart);
router.post('/add-quantity', authMiddleware, addQuantity);
router.delete('/delete-cart-items/:id', authMiddleware, deleteCartItem);

export default router;
