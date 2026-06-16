import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Access granted!", user: req.user });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
