import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler.js";
import  ApiError  from "../utils/apiError.js";

import  ApiResponse  from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
export const createComment = asynchandler(async (req, res) => {
  try {
    const { content } = req.body;
    const { videoID } = req.params;
  
    //Validate User authentication
    if (!req.user?._id) {
      throw new ApiError(401, "please login first");
    }
    //Validate comment Content
    if (!content || !content.trim()) {
      throw new ApiError(400, "Content is required");
    }
    //Validate VideoId
    if (!mongoose.Types.ObjectId.isValid(videoID)) {
      throw new ApiError(404, "Invalid VideoID");
    }
    //Check if the video exists
    const video = await Video.findById(videoID);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    //Create comment
    const comment = await Comment.create({
      content:content.trim(),
      video: videoID,
      owner: req.user._id,
    });
  
    // optional: populate owner info for response
    await comment.populate("owner", "name avatarUrl");
    return res
      .status(200)
      .json(
        new ApiResponse(200,
        { comment},
        "commented Successfully!!!"
      ));
  } catch (error) {
    console.log("Failed to comment :",error);
    throw new ApiError(500,"failed to comment ")
    
  }
});



export const  getAllVideoComment= asynchandler(async(req,res)=>{


    
});


export const updateComment  = asynchandler(async(req,res)=>{

})
export const deleteComment = asynchandler(async(req,res)=>{

})