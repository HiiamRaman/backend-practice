import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
export const getCurrentUser = asynchandler(async(req,res)=>{
    

    const user =  await User.findById(req.user?._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404,"User not found");
        
        
    }
    return res.status(200).json(new ApiResponse(200,{user},"User Fetched Succesfully!!"))



})