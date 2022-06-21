import express, { Request, Response } from "express";
import { body } from "express-validator";

import { BadRequestError } from "../errors";
import { User } from "../models";
import jwt from "jsonwebtoken";
import { Password } from "../services";
import { validateRequest } from "../middlewares";

const router = express.Router();

const signinBodySchema = [
  body("email").trim().isEmail().withMessage("Invalid Email or Password"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

router.post(
  "/api/users/signin",
  signinBodySchema,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid user name or password");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid user name or password");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
