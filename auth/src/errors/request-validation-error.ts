import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid Inputs");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError(): { message: string; field?: string | undefined }[] {
    return this.errors.map((e) => ({
      message: e.msg,
      field: e.param,
    }));
  }
}
