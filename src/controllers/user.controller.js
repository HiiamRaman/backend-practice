


import asynchandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadFile } from "../utils/fileUpload.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";

import generateTokensForUser from "../utils/tokenService.js";

import dotenv from "dotenv";
dotenv.config();


// USER REGISTERiRATION PROCESS

export const userRegister = asynchandler(async (req, res) => {
  //get user details from frontend
  
  // -------------------- VALIDATION --------------------
  
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
  
  /*
  const existingUser = await User.findOne({email})
  
  if(existingUser)  throw new ApiError(400,"Email already exist");
  {404," Email   already exist's"}  */
  
  //lets try to check either by username or email like insta do
  
  // -------------------- CHECK IF USER EXISTS --------------------
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  console.log("existingUser:", existingUser);
  
  if (existingUser) {
    throw new ApiError(409, "user already exists!");
  }
  
  // check for  the images of the avatar
  // -------------------- CHECK UPLOADED FILES --------------------
  
  console.log("Files received:", req.files);
  console.log("Body received:", req.body);
  
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  
  if (!avatarLocalPath) {
    throw new ApiError(404, "Avatar is required");
  }
  
  //This type of code is used when uploading the image is optional, not required.(Cover image)
  const coverimageLocalPath = req.files?.coverimage?.[0]?.path || "";
  
  //Upload them to Cloudinary(fileUpload.js)
  // -------------------- UPLOAD TO CLOUD --------------------
  
  const avatar = await uploadFile(avatarLocalPath); //uploadFile is that file we made for uploading on file fileUpload
  
  const coverimage = await uploadFile(coverimageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar image is required");
  }
  
  // create userobj and database entry
  // -------------------- CREATE USER  and Validation--------------------
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went erong while creating user");
  }
  
  //// -------------------- RETURN RESPONSE --------------------
  
  return res
  .status(201)
  .json(new ApiResponse(201, createdUser, "user registered succesfully!!!"));
});

/*
// Guidelines for Writing Controllers

// When creating a controller (e.g., userRegister), follow these best practices:

// Purpose

// Clearly define what the controller should do.

// Specify expected inputs and outputs.
// Example: userRegister receives name, email, and password, and returns a success message or error.

// Input Validation

// Always validate request data (req.body).

// Check required fields, data types, and formats.

// Use libraries like Joi or express-validator to enforce rules consistently.

// Business Logic

// Define the exact steps your controller performs:

// Check if the user already exists

// Hash passwords securely

// Save data to the database

// Generate JWT token (if authentication is required)

// Error Handling

// Use try/catch or async handlers for asynchronous code.

// Return clear, consistent error messages without leaking sensitive information.

// Security Considerations

// Do not return sensitive data (password, tokens) in responses.

// Validate inputs even for authenticated routes.

// Leverage JWT for authentication and protected routes.

// Response Structure

// Standardize API responses for consistency:

// {
  //   "success": true,
  //   "message": "User created successfully",
  //   "data": { "id": "...", "email": "..." }
  // }
  //   */
  
  // IF YOU WANT TO SEE WORKFLOW HERE IT IS
  
  // import asynchandler from "../utils/asynchandler.js";
  // import ApiResponse from "../utils/apiResponse.js";
  // import { uploadFile } from "../utils/fileUpload.js";
  // import ApiError from "../utils/apiError.js";
  // import { User } from "../models/user.model.js";
  
  // export const userRegister = asynchandler(async (req, res) => {
    //   // -------------------- STEP 1: Log incoming request --------------------
    //   console.log("---------- Incoming Request ----------");
    //   console.log("Body:", req.body);
    //   console.log("Files:", req.files);
    
    //   // -------------------- STEP 2: Extract user details --------------------
    //   const { fullname, email, username, password } = req.body;
    //   console.log("Extracted fields:", { fullname, email, username, password });
    
    //   // -------------------- STEP 3: Validation --------------------
    //   if (!fullname || fullname.trim() === "") throw new ApiError(404, "Full name is required!!");
    //   if (!email || email.trim() === "") throw new ApiError(404, "Email is required!!");
    //   if (!username || username.trim() === "") throw new ApiError(404, "Username is required!!");
    //   if (!password || password.trim() === "") throw new ApiError(404, "Password is required!!");
    
    //   // -------------------- STEP 4: Check if user already exists --------------------
    //   const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    //   if (existingUser) throw new ApiError(409, "User already exists!");
    
    //   // -------------------- STEP 5: Check uploaded files --------------------
    //   const avatarLocalPath = req.files?.avatar?.[0]?.path;
    //   const coverimageLocalPath = req.files?.coverimage?.[0]?.path;
    
    //   if (!avatarLocalPath) throw new ApiError(404, "Avatar is required");
    
    //   // -------------------- STEP 6: Upload files to Cloudinary --------------------
    //   console.log("Uploading avatar to Cloudinary...");
    //   const avatarUploadResult = await uploadFile(avatarLocalPath);
    //   const avatar = avatarUploadResult.secure_url || avatarUploadResult; // store only URL
    
    //   let coverimage = "";
    //   if (coverimageLocalPath) {
      //     console.log("Uploading cover image to Cloudinary...");
      //     const coverUploadResult = await uploadFile(coverimageLocalPath);
      //     coverimage = coverUploadResult.secure_url || coverUploadResult; // store only URL
      //   }
      
      //   // -------------------- STEP 7: Create user in database --------------------
      //   const user = await User.create({
        //     fullname,
        //     email,
        //     username: username.toLowerCase(),
        //     password,
        //     avatar,
        //     coverimage,
        //   });
        //   console.log("User created:", user);
        
        //   // -------------------- STEP 8: Fetch user without sensitive fields --------------------
        //   const createdUser = await User.findById(user._id).select("-password -refreshToken");
        
        //   // -------------------- STEP 9: Send response --------------------
        //   return res
        //     .status(201)
        //     .json(new ApiResponse(201, createdUser, "User registered successfully!"));
        // });
        
        //2. LOGIN PROCESS
        //       1. User sends email + password
        //           → Like showing an ID and PIN.
        
        //       2. Backend checks if both fields are provided
        //           → If missing, stop.
        
        //       3. Backend searches for the email in the database
        //           → If no such user, stop.
        
        //       4. Backend compares the typed password with the stored hashed password
        //           → If it doesn’t match, stop.
        
        //       5. If password is correct, backend creates access token + refresh token
        //           → These are like digital entry passes.
        
        //       6. Backend sends tokens + user info back
        //           → User is now logged in.
        
        export const loginUser = asynchandler(async (req, res) => {
          //first step extract dats from req.body
          
          //1 . User sends email/username + password
          
          const { email, password, username } = req.body;
          
          //    2. Backend checks if both fields are provided
          
          if (!username && !email) {
            throw new ApiError(404, "Username or Email is required");
          }
          
          // 3. Backend searches for the email in the database
          
          const user = await User.findOne({
            $or: [{ email }, { username }],
          });
          if (!user) {
            throw new ApiError(402, "User not found , Need to register first");
          }
          
          //4. Backend compares the typed password with the stored hashed password
          
          const passwordCorrect = await user.isPasswordCorrect(password);
          
          if (!passwordCorrect) {
            throw new ApiError(401, "Invalid Password");
          }
          //5. If password is correct, backend creates access token + refresh token
          
          const { accessToken, refreshToken } = await generateTokensForUser(user._id);
          
          
  // for security the user also contains password and refresh token so we need to deleete it

  const userData = user.toObject(); //converts it to a plain JavaScript object
  delete userData.password;
  delete userData.refreshToken;

  

  //6.   Backend sends tokens + cookie +  user info back
  // 1️ Set the refresh token in a cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // JS cannot access it
    secure: true, // only sent over HTTPS
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });



  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userData, accessToken },
        "Login Successfull",
        "user Loggedin succesfully!!!"
      )
    );
  //We send the user object so the frontend can display the user’s info immediately after login, like:Username,Email,Profile picture


});
