import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
export const userRegister = asynchandler(async (req, res) => {
  //get user details from frontend
  const { fullname, email, username, password } = req.body;

  if (fullname === "") {
    //if(!fullname){}
    throw new ApiError(404, "Full name is requiredd!!");
  }
  if (email === "") {
    throw new ApiError(404, "Email is requiredd!!");
  }
  if (username === "") {
    throw new ApiError(404, "username is requiredd!!");
  }
  if (password === "") {
    throw new ApiError(404, "password is requiredd!!");
  }

  //check if the user is already exists
  /*
const existingUser = await User.findOne({email})

if(existingUser)  throw new ApiError(400,"Email already exist");
{404," Email   already exist's"}  */

  //lets try to check either by username or email like insta do

  const existingUser = User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiErrorError(400, "user already exists!");
  }
});





/*
Guidelines for Writing Controllers

When creating a controller (e.g., userRegister), follow these best practices:

Purpose

Clearly define what the controller should do.

Specify expected inputs and outputs.
Example: userRegister receives name, email, and password, and returns a success message or error.

Input Validation

Always validate request data (req.body).

Check required fields, data types, and formats.

Use libraries like Joi or express-validator to enforce rules consistently.

Business Logic

Define the exact steps your controller performs:

Check if the user already exists

Hash passwords securely

Save data to the database

Generate JWT token (if authentication is required)

Error Handling

Use try/catch or async handlers for asynchronous code.

Return clear, consistent error messages without leaking sensitive information.

Security Considerations

Do not return sensitive data (password, tokens) in responses.

Validate inputs even for authenticated routes.

Leverage JWT for authentication and protected routes.

Response Structure

Standardize API responses for consistency:

{
  "success": true,
  "message": "User created successfully",
  "data": { "id": "...", "email": "..." }
}
  */
