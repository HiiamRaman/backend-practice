class ApiResponse {
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; //This automatically sets success to true or false based on the HTTP status code you pass.
  }
}

export default ApiResponse