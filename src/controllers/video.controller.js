import asynchandler from "../utils/asynchandler.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError";
export const getAllVideo = asynchandler(async (req, res) => {
  /*
    Mental Workflow:
    Fetch all videos from DB
    Sort by newest first
    Populate owner info (name, avatarUrl)
    Send structured API response
  */
  // Fetch all videos from DB, Sort by newest first,Populate owner info (name, avatarUrl)
  const videos = await Video.find()
    .sort({ createdAt: -1 })
    .populate("owner", "username avatarUrl");
  if (videos.length === 0) {
    throw new ApiError(400, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "All Videos Fetched Successfully"));
});
export const getVideoById = asynchandler(async (req, res) => {
  /*
    Mental Workflow:
    Get videoID from request params
    Validate videoID (must be a valid MongoDB ObjectId)
    Fetch the video from DB
    Check if video exists → throw 404 if not
    Populate owner info (name, avatarUrl)
    Return structured response
  */

  const { videoID } = req.params;
  if (!videoID || !mongoose.Types.ObjectId.isValid(videoID)) {
    throw new ApiError(400, "invaid videoID");
  }

  const video = await Video.findById(videoID);
  if (!video) {
    throw new ApiError(404, "Video not found !!!");
  }
  await video.populate("owner", "username avatarUrl");

  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video Fetched Successfully !!!"));
});
export const publishAVideo = asynchandler(async (req, res) => {
  /*
    Mental Workflow:
    Get videoID from params
    Validate videoID
    Fetch video from DB
    Check existence
    Authorization → Only owner can toggle
    Toggle isPublished field
    Save video
    Return structured response with status
  */
});
export const deleteVideo = asynchandler(async (req, res) => {
  /*
    Mental Workflow:
    Get videoID from params
    Validate videoID
    Fetch video from DB
    Check if video exists → throw 404 if not
    Authorization → Only owner can delete
    Delete video
    Return structured response
  */

  const { videoID } = req.params;
  if (!videoID || !mongoose.Types.ObjectId.isValid(videoID)) {
    throw new ApiError(400, "videoID is invalid");
  }

  //fetch videos

  const videos = await Video.findById(videoID);
  //check if the videos exists
  if (!videos) {
    throw new ApiError(400, " no Videos are present");
  }

  //authorization check
  if (videos.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "only owner can delete the video");
  }

  await Video.findByIdAndDelete(videoID);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted Successfully!!"));
});
export const udateVideo = asynchandler(async (req, res) => {
  const { videoID } = req.params;
  const { title, description } = req.body;

  if (!videoID || !mongoose.Types.ObjectId.isValid(videoID)) {
    throw new ApiError(400, "Invaid VideoID");
  }
  if (!title && !description) {
    throw new ApiError(400, " at least one Title or Description are required");
  }

  const video = await Video.findById(videoID);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }
  //authenticate
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "only owner can update video");
  }

  //set content

  if (video) {
    video.title = title.trim();
  }

  if (description) {
    video.description = description.trim();
  }

  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video updated successfully!!"));
});
export const togglePublishStatus = asynchandler(async (req, res) => {
  /*
    Mental Workflow:
    Get videoID from params
    Validate videoID
    Fetch video from DB
    Check existence
    Authorization → Only owner can toggle
    Toggle isPublished field
    Save video
    Return structured response with status
  */

  const { videoId } = req.params;
  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "invalid videoid");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "videos not found");
  }

  //authorization
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Only owner can toggle publish status");
  }
  //toggle is publised field
  video.isPublished = !videos.isPublished;
  await video.save();

  const status = video.isPublished? "published" : "Not published"
  return res
    .status(200)
    .json(
      new ApiResponse(200, { status }, "Toggled publish status successfully!!!")
    );
});
