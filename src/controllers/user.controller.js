import asynchandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import generateTokensForUser from "../Services/tokenService.js";

import dotenv from "dotenv";
import jwt from "jsonwebtoken"
//import { handleUserFile } from "../Services/fileService.js";

dotenv.config();
// USER REGISTERiRATION PROCESS ,visit Readme.md

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

  const avatar = await uploadOnCloudinary(avatarLocalPath); //uploadOnCloudinary is that file we made for uploading on file fileUpload

  const coverimage = await uploadOnCloudinary(coverimageLocalPath);
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
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "user registered succesfully!!!"
      )
    );
});

// IF YOU WANT TO SEE WORKFLOW HERE IT IS

// import asynchandler from "../utils/asynchandler.js";
// import ApiResponse from "../utils/apiResponse.js";
// import { uploadOnCloudinary } from "../utils/fileUpload.js";
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
//   const avatarUploadResult = await uploadOnCloudinary(avatarLocalPath);
//   const avatar = avatarUploadResult.secure_url || avatarUploadResult; // store only URL

//   let coverimage = "";
//   if (coverimageLocalPath) {
//     console.log("Uploading cover image to Cloudinary...");
//     const coverUploadResult = await uploadOnCloudinary(coverimageLocalPath);
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

//2. LOGIN PROCESS   visit Readme.md

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
  const cookieOptions = {
    httpOnly: true, // JS cannot access it
    secure: process.env.NODE_ENV === "production", // only sent over HTTPS
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

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

// LOGOUT CONTOLLER

export const logoutUser = asynchandler(async (req, res, next) => {
  console.log("user requested for logout");

  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User already logged out"));
  }

  await User.updateOne(
    { refreshToken },

    {
      $set: { refreshToken: null },
    },
    { new: true }
  );

  // 4. Clear refresh token  and accessToken cookie from browser

  const cookieOptions = {
    httpOnly: true, // JS cannot access
    secure: process.env.NODE_ENV === "production", // only https
    sameSite: "Strict", // CSRF protection
  };

  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);

  //  new ApiResponse(status, data, message, description)
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out Successfully"));
});

// REFRESH TOKEN ROTATION

export const refreshAccessToken = asynchandler(async (req, res, next) => {
  /* 1. Extract refresh token from cookies
       2. Verify the refresh token signature & expiry
       3. Find user using the decoded ID
       4. Compare incoming refresh token with DB-stored token
       5.  Generate NEW tokens (access + refresh)
       7. Send back the new access token
    */

  //1. Extract refresh token from cookies

  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "incomingRefreshToken not found");
    }
    // 2. Verify the refresh token signature & expiry

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN
    );

    //3. Find user using the decoded ID

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "user not found");
    }
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid Authentication");
    }
    // 5. Generate NEW tokens (access + refresh)

    const { accessToken, refreshToken } = await generateTokensForUser(user);

    // user.refreshToken = refreshToken;
    // await user.save({ validateBeforeSave: false });    it can be also done by

    // store in db
    await User.findByIdAndUpdate(
      user._id,
      {
        $set: { refreshToken: refreshToken },
      },
      { new: true }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: true, accessToken },
          "AccessToken re-generlated Successfully"
        )
      );
  } catch (error) {
    console.log("Error",error)
    throw new ApiError(500, "Failed to regenerate Accestoken");
  }
});

// CHANGE USER'S PASSWORD   (visit readme.md)

export const changePassword = asynchandler(async (req, res) => {
  try {
    //STEPS THAT NEED TO BE FOLLOWED

    const { confirmPassword, oldPassword, newPassword } = req.body;
    //Order must be:

    //Validate input
    if (!confirmPassword || !oldPassword || !newPassword) {
      throw new ApiError(400, "All fields are required!!!");
    }

    // Find user

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Compare old password
    const validPassword = await user.isPasswordCorrect(oldPassword);
    if (!validPassword) {
      throw new ApiError(400, " invalid password ");
    }

    // Compare new and confirm

    if (!(newPassword === confirmPassword)) {
      throw new ApiError(400, "newPassword must be same to confirmPassword");
    }

    // Set new password
    user.password = newPassword;
    // Save → triggers hashing middleware
    await user.save();

    // Send response
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "password has changed succesfully"));

    // If we flip these steps → security breaks.
  } catch (error) {
    throw new ApiError(500, "Failed to Change the passsword");
  }
});

// UPDATE USER PROFILE

export const updateUser = asynchandler(async (req, res) => {
  // const { confirmPassword, oldPassword, newPassword } = req.body;
  // we cannot make entrys like this because updation depends on user what he wants to update
  // so we have to use the partial approach for data entry.

  // 1. Define which fields are allowed to change (whitelist)
  const allowedFields = [
    "username",
    "fullname",
    "bio",

    "theme",
    "language",
    "phone",
    "notificationSetting",
  ];

  const incomingFields = Object.keys(req.body);
  //Object.keys() ---> returns an array of ALL the keys inside that object

  // if no fields are sent then return errror
  if (incomingFields.length === 0) {
    throw new ApiError(400, "No fields are provided to update");
  }
  // make sure every incomingFields are allowedFields

  const validFields = incomingFields.every((field) =>
    allowedFields.includes(field)
  );
  if (!validFields) {
    throw new ApiError(400, "invalid fields are detected - update not allowed");
  }

  // Find the logged-in user using ID extracted from JWT middleware (req.user)
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  // Apply all incoming fields to user object
  // Example: user.fullname = req.body.fullname
  // This loop automatically updates whichever allowed fields were sent

  //   Update text fields
  incomingFields.forEach(
    (field) => (user[field] = req.body[field])
    //user["username"] = req.body["username"];
    //user.username = "raman_new";
  );

  // Update avatar/cover via service

  //       const uploadedFiles =  await handleUserFile(req.files) ;
  //       Object.assign(user,uploadedFiles);  // merge uploaded URLs into user
  //       await user.save()

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "users data updated successfully!"));
});

export const UserChannelProfile = asynchandler(async (req, res) => {
  const { username } = req.params; //params means url
  if (!username?.trim()) throw new ApiError(404, "username not found");

  const channelProfile = await User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: "subscriptions", //subscription model bata lageko!!!
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribed",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers", //$size basically counts
        },
        channelSubscribedCount: {
          $size: "$subscribed",
        },

        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscriberCount: 1,
        channelSubscribedCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverimage: 1,
      },
    },
  ]);
  if (!channelProfile.length) {
    throw new ApiError(400, "channelProfile doesnot Exists");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelProfile[0],
        "ChannelProfile fetched successfully!!"
      )
    );
});
