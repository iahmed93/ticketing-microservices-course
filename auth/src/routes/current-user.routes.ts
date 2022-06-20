import express from "express";
import { currentUser, requireAuth } from "../middlewares";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  requireAuth,
  async (req, res) => {
    return res.send({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
