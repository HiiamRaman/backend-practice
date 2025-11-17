
import { User } from "../models/user.model.js";
import ApiError from "./apiError.js";
// here we are trying to create a methods for creation of acces token and refresh token


/* 1.find the user with the help on data base
   2.Generates access and refresh tokens for a user
   3.save refreshtoken in databse
   4.return accesstoken adn refresh token
*/




 const generateTokensForUser = async (userId) => {
  try {
    // Find user by database
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // we have to save refreshToken in db

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something were wrong while generating tokens");
  }
};

export default generateTokensForUser;