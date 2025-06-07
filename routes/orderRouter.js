import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderUser,
  updateOrderStatus,
  getUserOrders
} from '../controllers/orderController.js';

import {
  createPayment,
  verifyPayment,
  getPayments
} from '../controllers/paymentController.js';

import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.get('/get-all-order', getAllOrders); // admin

router.get('/get-order-by-id/:orderId', getOrderById);
router.put('/update-Order/:orderId', updateOrderUser);
router.patch('/update-order-status/:orderId', updateOrderStatus); // admin
router.get('/get-user-order', getUserOrders);

router.post('/:orderId/payment', createPayment);
router.post('/verify-payment', verifyPayment);
router.get('/get-all-payments', getPayments);

export default router;
