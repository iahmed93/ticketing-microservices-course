export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(msg: string) {
    super(msg);
    // only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeError(): { message: string; field?: string }[];
}
