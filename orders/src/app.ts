import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@islamahmed93/common";
import { createOrderRouter, deleteOrderRouter, readOrderRouter } from "./routes";


const app = express();

app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use('/api/orders', readOrderRouter);
app.use('/api/orders', createOrderRouter);
app.use('/api/orders', deleteOrderRouter);

app.get("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
