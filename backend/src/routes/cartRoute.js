import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { requireCustomer } from "../middlewares/roleMiddleware.js";

const router = Router();

// All routes require authentication
router.use(verifyToken);
router.use(requireCustomer);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:itemId", updateCartItem);
router.delete("/:itemId", removeFromCart);
router.delete("/", clearCart);

export default router;
