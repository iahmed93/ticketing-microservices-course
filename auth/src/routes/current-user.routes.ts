import express from "express";
import { currentUser } from "@islamahmed93/common";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  // requireAuth,
  (req, res) => {
    return res.json({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
