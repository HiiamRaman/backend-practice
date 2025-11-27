import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler.js";
import  ApiError  from "../utils/apiError.js";

import  ApiResponse  from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
export const createComment = asynchandler(async (req, res) => {
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
});
