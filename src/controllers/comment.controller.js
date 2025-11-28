import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apiError.js";

import ApiResponse from "../utils/apiResponse.js";
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
      content: content.trim(),
      video: videoID,
      owner: req.user._id,
    });

    // optional: populate owner info for response
    await comment.populate("owner", "name avatarUrl");
    return res
      .status(200)
      .json(new ApiResponse(200, { comment }, "commented Successfully!!!"));
  } catch (error) {
    console.log("Failed to comment :", error);
    throw new ApiError(500, "failed to comment ");
  }
});

export const getAllVideoComment = asynchandler(async (req, res) => {
  try {
    const { videoID } = req.params;

    if (!videoID) {
      throw new ApiError(400, "VideoID not found");
    }

    const allComments = await Comment.find({ video: videoID }) //findById() ONLY accepts a single _id value. so we use find
      .sort({ createdAt: -1 }) //sort newest to older
      .populate("owner", "name avatarUrl"); //optional
    return res
      .status(200)
      .json(new ApiResponse(200, { allComments }, " Fetched All Comments "));
  } catch (error) {
    console.log("Eror while getting all comments :", error);
    throw new ApiError(500, "failed to get all comments");
  }
});

export const updateComment = asynchandler(async (req, res) => {
  /*  Mental Flow
  Input → commentID (params) + new content (body)
Validate inputs → check IDs + required fields
Fetch from DB → Comment.findById(commentID)
Authorization → only owner can update
Update fields → comment.content = ...
Save changes → comment.save()
Populate / format response → optional
Send structured response → consistent API format */
  try {
    const { commentID } = req.params;
    const { content } = req.body; //new content for user to write new comment

    if (!commentID) {
      throw new ApiError(400, "Invalid Comment Id ");
    }
    if (!content?.trim()) {
      throw new ApiError(400, "Content is required");
    }
    // validate commentID
    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      throw new ApiError(400, "Invlaid commentID");
    }

    const comment = await Comment.findById(commentID);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Owner can only update the comment");
    }

    //save in database

    comment.content = content.trim();
    await comment.save();
    //
    // owner info into reponse
    await comment.populate("owner", "name avatarUrl");
    //response

    return res
      .status(200)
      .json(
        new ApiResponse(200, { comment }, "Comment updated successfully!!")
      );
  } catch (error) {
    console.log("Failed to Update Comment", error);
    throw new ApiError(500, "Cannot Update Comment");
  }
});
export const deleteComment = asynchandler(async (req, res) => {
  /* Input: Get commentID from route params
Validate inputs: Check if commentID exists and is a valid MongoDB ObjectId
Fetch comment: Use Comment.findById(commentID)
Check existence: If comment doesn’t exist → 404
Authorization: Only owner of the comment can delete → 403 if not
Delete comment: Use .deleteOne() or .remove()
Send response: Structured JSON response with success message */

  //Validate inputs
  const { commentID } = req.params;
  if (!commentID || !mongoose.Types.ObjectId.isValid(commentID)) {
    throw new ApiError(400, "commentID is invalid");
  }

  //Fetch comment
  const comment = await Comment.findById(commentID);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  //Authorization for owner

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can do this process");
  }
  //Delete comment
  await Comment.findByIdAndDelete(commentID);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted Successfully"));
});
