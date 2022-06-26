import express from "express";
import { currentUser, requireAuth } from "../middlewares";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  requireAuth,
  (req, res) => {
    return res.json({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
