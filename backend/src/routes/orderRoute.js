import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requireCustomer,
} from "../middlewares/roleMiddleware.js";

const router = Router();

// Customer routes
router.post("/", verifyToken, requireCustomer, createOrder);
router.get("/my-orders", verifyToken, requireCustomer, getUserOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id/cancel", verifyToken, requireCustomer, cancelOrder);

// Admin routes
router.get("/admin/all", verifyToken, requireAdmin, getAllOrders);
router.put("/:id/status", verifyToken, requireAdmin, updateOrderStatus);

export default router;
