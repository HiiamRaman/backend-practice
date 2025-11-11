class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong",
    errors = [],
    stack
  ) {
    super(message); // Call parent Error constructor with the message
    this.statusCode = statusCode; // this actually helps us to set http status code
    this.message = message; // set the error message
    this.errors = errors; // set additional errors
    this.stack = stack; // set custom stack if provided
    this.success = false; // set directly, not passed

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); 
    }
  }
}
export default ApiError
