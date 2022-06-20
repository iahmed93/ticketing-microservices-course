import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/index";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeError() });
  }
  res.status(400).send({
    message: "Something went wrong",
  });
};
