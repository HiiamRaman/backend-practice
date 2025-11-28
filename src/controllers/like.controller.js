import asynchandler from "../utils/asynchandler";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const toggleCommentLike = asynchandler(async (req, res) => {
  /* 
    Mental Flow:
    Input → commentID (params)
    Validate → check valid ObjectId
    Fetch comment → Comment.findById
    Check existence
    Toggle like:
      - If user already liked → remove like
      - Else → add like
    Save comment
    Respond with updated comment + message
  */

  //Input
  const { commentID } = req.params;

  if (!commentID || !mongoose.Types.ObjectId.isValid(commentID)) {
    throw new ApiError(400, "Require Valid commentID");
  }
  //Fetch Comment
  const comment = await Comment.findById(commentID);
  if (!comment) {
    throw new ApiError(400, " comment not found");
  }

  let message;

  //Toggle Like
  const userID = req.user._id.toString(); // cahnging into string for comparision
  // so basically  some gives a cback function and it iterates all items inside it and change it intostring then it compares id from params right?
  const alreadyLiked = comment.likes.some(
    (id) => id.toString() == userID.toString()
  ); //checking that likes object is present in Like model

  if (alreadyLiked) {
    //Unlike _Logic

    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userID
    );
    message = "user disliked";
  } else {
    //Like
    comment.likes.push(userID);
    message = "user liked";
  }
  await comment.save();
  await comment.populate("owner", "name avatarUrl"); //owner is defined in comment model

  return res
    .status(200)
    .json(new ApiResponse(200, {comment}, "toggled like comment succesfully"));
});
export const toggleVideoLike = asynchandler(async (req, res) => {});
export const toggleTweetLike = asynchandler(async (req, res) => {});
export const getLikedVideo = asynchandler(async (req, res) => {});
