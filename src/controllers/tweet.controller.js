import asynchandler from "../utils/asynchandler.js";
import { Tweet } from "../models/tweet.model";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import mongoose from "mongoose";
export const createTweets = asynchandler(async (req, res) => {
  /*
    Mental Workflow:
    Extract content from req.body
    Validate content (existence + length)
    Ensure user is logged in
    Create a new Tweet in DB
     Populate owner info
     Return structured response
  */

  const { content } = req.body;

  if (!content || !content.trim()) {
    throw new ApiError(400, "Content is Required");
  }

  //user loggedin?
  const user = req.user._id;
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  //create tweeet
  const tweet = await Tweet.create({
    owner: user,
    content: content.trim(),
  });
  await tweet.populate("owner", "username avatar");

  return res
    .status(201)
    .json(new ApiResponse(201, { tweet }, "tweet is created successfully!!"));
});
export const getUserTweets = asynchandler(async (req, res) => {
  /*
    Mental Workflow:
    Get userID from params or logged-in user
    Validate userID
    Fetch all tweets of the user
    Sort newest first
    Populate owner info
    Send structured response
  */

  const { userID } = req.params;
  if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
    throw new ApiError(400, "invalid userID");
  }

  //fetch all tweets from user
  const tweets = await Tweet.find({ owner: userID })
    .sort({ createdAt: -1 })
    .populate("owner", "username avatarUrl");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { tweets }, "Fetched all Tweets Successfully!!!")
    );
});
export const deleteTweets = asynchandler(async (req, res) => {

     const { tweetID } = req.params;
     if (!tweetID || !mongoose.Types.ObjectId.isValid(tweetID)) {
       throw new ApiError(400, "invalid Tweetid");
     }
     //check if there is tweet or not
     const tweet = await Tweet.findById(tweetID);
     if (!tweet) {
       throw new ApiError(404, "Tweet not Found");
     }
   
     //check authorixation so only owner cna delete it
     if (tweet.owner.toString() !== req.user._id.toString()){
       throw new ApiError(403,"Only owner can delete the tweet");
       
     }
   
     await Tweet.findByIdAndDelete(tweetID);
   
     return res
       .status(200)
       .json(new ApiResponse(200, null, "Tweet deleted successfully!!"));

});
export const updateTweets = asynchandler(async (req, res) => {



    
});
