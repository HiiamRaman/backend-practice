import asynchandler from "../utils/asynchandler.js";
import { Playlist } from "../models/playlist.model.js";
import ApiResponse from "../utils/apiResponse.js";
import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
export const createPlaylist = asynchandler(async (req, res) => {
  /*
      Mental Workflow:
      1. Extract name, description from body
      2. Validate name (required)
      3. Create playlist with owner = req.user._id
      4. Save in DB
      5. Return success response
  */

  const { name, description } = req.body;
  if (!name || name.trim().length === 0) {
    throw new ApiError(400, "Name is required!!!");
  }

  //create playlist
  const playlist = await Playlist.create({
    name: name.trim(),
    description: description || "",
    owner: req.user._id,
    videos: [],
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, { playlist }, "Playlist created successfully!!!")
    );
});
export const getUserPlaylist = asynchandler(async (req, res) => {
  /*
      Mental Workflow:
      1. Get user ID from req.user
      2. Fetch all playlists created by the user
      3. If no playlist, return empty array (not an error)
      4. Send response
  */

  //get userID

  const userID = req.user._id;
  if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
    throw new ApiError(400, "Invalid Userid!!");
  }

  const playlist = await Playlist.find({ owner: userID }).sort({
    createdAt: -1,
  });

  if (playlist.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "user has no playlist!!"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { playlist }, "Playlist fetched successfully!!!")
    );
});
export const getPlaylistById = asynchandler(async (req, res) => {
  /*
      Mental Workflow:
      1. Extract playlistID from URL params
      2. Validate playlistID
      3. Fetch playlist by ID
      4. Optionally populate videos
      5. Return playlist in structured response
  */

  const { playlistID } = req.params;
  if (!playlistID || !mongoose.Types.ObjectId.isValid(playlistID)) {
    throw new ApiError(400, "Invalid PlaylistID");
  }

  //fetch playlist

  const playlist = await Playlist.findById(playlistID)
    .populate("owner", "username avatarUrl")
    .populate("videos", "title url duration");
  if (!playlist) {
    throw new ApiError(404, "playlist not found!!!");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "only owner can fetch playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { playlist }, "playlistbyId fetched successfully!!!")
    );
});
export const addVideoToPlaylist = asynchandler(async (req, res) => {
  /*
      Mental Workflow:
      1. Extract playlistID from URL params
      2. Extract videoID from request body
      3. Validate both IDs
      4. Fetch playlist
      5. Check ownership
      6. Check if video already exists in playlist
      7. Add video
      8. Save playlist and return response
  */

  const { playlistID } = req.params;
  const { videoID } = req.body;

  if (!playlistID || !mongoose.Types.ObjectId.isValid(playlistID)) {
    throw new ApiError(400, "playlistId is invalid");
  }
  if (!videoID || !mongoose.Types.ObjectId.isValid(videoID)) {
    throw new ApiError(400, "videoID is invalid");
  }

  const playlist = await Playlist.findById(playlistID);
  if (!playlist) {
    throw new ApiError(400, "invalid playlist");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "only owner can add videos");
  }

  if (playlist.videos.includes(videoID)) {
    throw new ApiError(400, "Video already exists");
  }

  // Add video
  playlist.videos.push(videoID);

  await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { playlist }, "video Added successfully to playlist")
    );
});
export const removeVideoFromPlaylist = asynchandler(async (req, res) => {
  /*
      Mental Workflow:
      1. Extract playlistID from URL params
      2. Extract videoID from request body
      3. Validate both IDs
      4. Fetch playlist
      5. Check ownership
      6. Check if video exists in playlist
      7. Remove video
      8. Save playlist and return response
  */
  const { playlistID } = req.params;
  const { videoID } = req.body;
  if (!playlistID || !mongoose.Types.ObjectId.isValid(playlistID)) {
    throw new ApiError(400, "invalid playlistID");
  }
  if (!videoID || !mongoose.Types.ObjectId.isValid(videoID)) {
    throw new ApiError(400, "invalid videoID");
  }

  const playlist = await Playlist.findById(playlistID);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "only owner can delete the vide");
  }

  if (playlist.video.includes(videoID)) {
    playlist.videos = playlist.videos.filter(
      (id) => id.toString() !== videoID.toString()
    );
  } else {
    throw new ApiError(400, "Video not found in playlist");
  }
  await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist },
        "playlist video deleted successfully!!"
      )
    );
});
export const deletePlaylist = asynchandler(async (req, res) => {
  const { playlistID } = req.params;
  if (!playlistID || !mongoose.Types.ObjectId.isValid(playlistID)) {
    throw new ApiError(400, "invalid playlistId");
  }

  const playlist = await Playlist.findById(playlistID);
  //authenticate

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "only owner can delete playlist!!");
  }
  await Playlist.findByIdAndDelete(playlistID);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "playlist deleted succesfully!!"));
});
export const updatePlaylist = asynchandler(async (req, res) => {
  /*
      Mental Workflow:
      1. Extract playlistID from URL params
      2. Extract fields to update from request body
      3. Validate playlistID
      4. Fetch playlist
      5. Check ownership
      6. Update allowed fields
      7. Save playlist and return updated playlist
  */

  const { playlistID } = req.params;
  const { description, name, thumbnail } = req.body;

  if (!playlistID || !mongoose.Types.ObjectId.isValid(playlistID)) {
    throw new ApiError(400, "invalid playlistID!!");
  }

  const playlist = await Playlist.findById(playlistID);
  if (!playlist) {
    throw new ApiError(404, "playlist not found!!");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "only owner can update playlist");
  }

  //  Update fields if provided
  if (name && name.trim().length > 0) {
    playlist.name = name.trim();
  }
  if (thumbnail) {
    playlist.thumbnail = thumbnail;
  }
  if (description) {
    playlist.description = description;
  }

  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, { playlist }, "playlist is updated successfully")
    );
});
