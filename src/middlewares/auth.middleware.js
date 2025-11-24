import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apiError.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
  try {
    console.log("Middleware verifying access token");
    // 1. Read token from headers (Frontend sends it as Authorization: Bearer token)
    // const token = req.headers.authorization?.replace("Bearer",""); replace keyword makes a space so verification might fail

    console.log("Authorization header:", req.headers.authorization);

    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
    console.log("Extracted token is :", token);

    if (!token) {
      throw new ApiError(401, "NO  Access token received!!!!");
    }

    // 2.  Verify Token

    const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(" Token Decoded:", decodedToken);

    // 3. Find user from decodedToken user ID

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    console.log("User Fetched from DB", user);

    if (!user) {
      throw new ApiError(401, "Invalid Access token");
    }

    // 4. Attach user to req.user → Now protected routes can use req.user

    req.user = user;
    next();
  } catch (error) {
    //throw new ApiError(401,"Middleware failed");
    next(error);
  }
});
