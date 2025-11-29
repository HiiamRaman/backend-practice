import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asynchandler from "../utils/asynchandler.js";
import mongoose from "mongoose";
import {Like} from '../models/likes.model.js'
import {Subscription} from '../models/subscription.model.js'
import { Video } from "../models/video.model.js";
export const getChannelStats = asynchandler(async (req, res) => {
  /* Mental Flow:
     1. Get the logged-in user ID from the request.
    2. Validate the user.
    3. Aggregate total videos and total views for the user's channel.
    4. Aggregate total subscribers for the channel.
    5. Aggregate total likes across all videos of this channel.
    6. Return a structured response. */

  const userID = req.user._id;
  if (!userID) {
    throw new ApiError(400, "user not found");
  }
  //we need to convert the userID into object type so we can do aggregation

  //const ObjectuserId =  new mongoose.Types.ObjectId(userID)

  // Convert to ObjectId only if it's a string
  const objectUserId =
    typeof userID === "string" ? new mongoose.Types.ObjectId(userID) : userID;

  //Aggregate total videos and total views for the user's channel.

  // Run all aggregation queries in parallel for performance
  const [ videoStats, likeStats, subscriberStats ] = await Promise.all([
    //  Total videos and total views
    Video.aggregate([
      { $match: { owner: objectUserId } }, // Filter videos owned by the user
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 }, //count total videos
          totalViews: { $sum: "$views" }, //count total views
        },
      },
      // Total subscribers for this channel
    ]),

    //Total likes all across channel
    Like.aggregate([
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoData",
        },
      },
      { $unwind: "$videoData" },
      { $match: { "videoData.owner": objectUserId } }, // Only likes for this user's videos
      {
        $group: {
          _id: null,
          totalLikes: { $sum: 1 }, //count likes
        },
      },
    ]),
// Total subscribers for this channel
Subscription.aggregate([
    {$match :{channel:objectUserId}},// Filter subscriptions to this channel
    {
        $group : {
            _id : null,
            totalSubscribers:{$sum:1}//count all suscribers
        }
    }
])


  ]);

// Extract results safely and provide defaults if empty
  const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers: subscriberStats[0]?.totalSubscribers || 0,
        totalLikes: likeStats[0]?.totalLikes || 0,
    };

    return res.status(200).json(new ApiResponse(200,{stats},"channel stats fetched succesfully!!"))


});
export const getChnanelVideos = asynchandler(async (req, res) => {});
