import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Route not found");
    // only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): { message: string; field?: string | undefined }[] {
    throw new Error("Method not implemented.");
  }
}
