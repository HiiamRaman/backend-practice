import { User } from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apiError.js";

export const updateEmail = asynchandler(async (req, res) => {
  //1.new email
  //2.if not entered  throw error
  //3.check format
  //4.find existing email
  //6.save in db
  //7.return resp
  console.log("req.user : ", req.user)
  try {
    const { newEmail } = req.body;
    if (!newEmail || newEmail.trim() === "") {
      throw new ApiError(400, "Email is required!!");
    }

    // Validate proper email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new ApiError(400, "Invalid email format");
    }
    // if entered email already exists

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      throw new ApiError(400, "email already exists try another email");
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email: newEmail },
      { new: true }
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    //remove password and refreshtoken

    const safeUser = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );

    if (!safeUser) {
      throw new ApiError(400, "failed to  find user");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { safeUser }, "Email updated successfully"));
  } catch (error) {
    console.log("Failed to update email : ", error);
    throw new ApiError(500, "Failed while updating Email");
  }
});
