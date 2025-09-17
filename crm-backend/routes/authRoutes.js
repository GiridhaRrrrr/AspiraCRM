import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import protect from '../middleware/authMiddleware.js';
import { updateUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put('/profile', protect, updateUser);

export default router;
