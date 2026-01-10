import express from "express";
import {
  authUser,
  getAllUsers,
  getUserById,
  updateUserStatus,
} from "../controllers/userController.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/user", authUser);
router.get("/", requireAdmin, getAllUsers);
router.get("/:id", requireAdmin, getUserById);
router.patch("/:id/status", requireAdmin, updateUserStatus);

export default router;
