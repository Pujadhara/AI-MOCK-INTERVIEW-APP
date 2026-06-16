import express from "express";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Dashboard data fetched",
    user: req.user,   // from token
    interviews: []    // later we will add DB data
  });
});

export default router;
