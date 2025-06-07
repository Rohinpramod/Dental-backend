import express from 'express';
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupons,
  applyCoupon
} from '../controllers/couponController.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/create-coupon', createCoupon);
router.post('/apply-coupon', applyCoupon);
router.put('/update-coupon/:id', updateCoupon);
router.delete('/delete-coupon/:id', deleteCoupon);
router.get('/get-coupon', getCoupons);

export default router;
