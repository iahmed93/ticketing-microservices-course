import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(private msg: string) {
    super(msg);

    // only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeError(): { message: string; field?: string | undefined }[] {
    return [{ message: this.msg }];
  }
}
