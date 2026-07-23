import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Require login for all order-related endpoints
router.use(protect);

router.post('/', validate(orderController.createOrderSchema), orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderDetails);
router.post('/:id/cancel', orderController.cancelOrder);

// Admin operations
router.get('/admin/all', restrictTo('ADMIN'), orderController.getAllOrders);
router.patch(
  '/admin/:id/status',
  restrictTo('ADMIN'),
  validate(orderController.updateOrderStatusSchema),
  orderController.updateOrderStatus
);

export default router;
