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

    comment.likes = comment.likes.filter((id) => id.toString() !== userID);
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
    .json(
      new ApiResponse(200, { comment }, "toggled like comment succesfully")
    );
});

// toggleVideoLike logic is very similar to comment like
export const toggleVideoLike = asynchandler(async (req, res) => {
  /* 
    Mental Flow:
    Input → videoID (params)
     Validate → check valid ObjectId
    Fetch video → Video.findById(videoID)
    Check existence
    Toggle like:
         - If user already liked → remove like
         - Else → add like
    Save video
    Respond with updated video + message
  */
  const { videoID } = req.params;

  if (!videoID || !mongoose.Types.ObjectId.isValid(videoID)) {
    throw new ApiError(400, "invalid VideoID");
  }
  let message;
  const video = await Video.findById(videoID);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const userID = req.user._id.toString();
  const alreadyLiked = video.likes.some((id) => id.toString() === userID);
  if (alreadyLiked) {
    //unlike
    video.likes = video.likes.filter((id) => id.toString() !== userID);
    message = "Video Unliked";
  } else {
    //like
    video.likes.push(userID);
    message = "Video Liked";
  }
  await video.save();
  await video.populate("owner", "name avatarUrl");
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Toggled Video like successfully!!"));
});
export const getLikedVideo = asynchandler(async (req, res) => {
  /*
    Mental Flow:
    - Get userId from req.user
    - Fetch videos where likes[] contains userId
    - Return list
  */
  //Get UserId
  try {
    const userID = req.user._id;
    if (!userID) {
      throw new ApiError(400, "Invalid userID");
    }

    //Fetch videos
    const likedVideos = await Video.find({ likes: userID })
      .populate("owner", "name avatarUrl")
      .sort({ createdAt: -1 }); //for newest likes

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { likedVideos },
          "Liked videos fetched successfully!!!"
        )
      );
  } catch (error) {
    console.log("Failed to getliked videos ", error);
    throw new ApiError(500, "Failed to getliked videos");
  }
});
export const toggleTweetLike = asynchandler(async (req, res) => {
  /*
    Mental Flow:
    - Get tweetID from params
    - Validate ObjectId
    - Fetch tweet
    - Check existence
    - Check if user already liked
    - Toggle like/unlike
    - Save and respond
  */
  const { tweetID } = req.params;
  let message;
  if (!tweetID || !mongoose.Types.ObjectId.isValid(tweetID)) {
    throw new ApiError(400, "invalid TweetId");
  }

  const tweet = await Tweet.findById(tweetID);
  if (!tweet) {
    throw new ApiError(400, "tweet not found");
  }

  const userID = req.user._id.toString();

  //already liked
  const alreadyLiked = tweet.likes.some((id) => id.toString() === userID);
  if (alreadyLiked) {
    //Unlike
    tweet.likes = tweet.likes.filter((id) => id.toString() !== userID); //unlike
    message="Tweet unLiked";
  } else {
     tweet.likes.push(userID);
    message="Tweet liked";
  }

  await tweet.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Toggled tweet like successfully!!"));
});
