import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler";
import ApiError from "../utils/apiError";
import { Subscription } from "../models/subscription.model";
import ApiResponse from "../utils/apiResponse";

export const toggleSubscription = asynchandler(async (req, res) => {
  /*
    Mental Workflow:
    1. Extract channelID from params (channel to subscribe/unsubscribe)
    2. Validate channelID
    3. Prevent subscribing to self
    4. Check if subscription already exists
    5. If exists → unsubscribe (delete)
       If not exists → subscribe (create)
    6. Return structured response
  */

  const { channelID } = req.params;
  const subscriberID = req.user._id;
  if (!channelID || !mongoose.Types.ObjectId.isValid(channelID)) {
    throw new ApiError(400, "invalid ChannelID");
  }

  // Prevent subscribing to self

  if (subscriberID.toString() === channelID.toString()) {
    throw new ApiError(403, "Cannot subscribe own channel!!");
  }

  //Check if subscriber already exists

  const existingsubscriber = await Subscription.findOne({
    subscriber: subscriberID,
    channel: channelID,
  });
  if (existingsubscriber) {
    //unsuscribe

    await existingsubscriber.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Channel Unsuscribed successfully!!"));
  }
  const subscribed = await Subscription.create({
    subscriber: subscriberID,
    channel: channelID,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { subscribed }, "user subscribed successfully!!")
    );
});
export const getUserChannelSubscribers = asynchandler(async (req, res) => {
  /*
    Mental Workflow:
    1. Extract channelID from params (the channel whose subscribers we want)
    2. Validate channelID
    3. Fetch all subscriptions where channel = channelID
    4. Populate subscriber info (username, avatar)
    5. Return structured response
  */

  const { channelID } = req.params;

  if (!channelID || !mongoose.Types.ObjectId.isValid(channelID)) {
    throw new ApiError(400, "invalid ChannelID");
  }

  const subscribers = await Subscription.find({
    channel: channelID,
  }).populate("subscriber", "username avatarUrl");

  if (!subscribers || subscribers.length===0) {
    return res.status(200).json(new ApiResponse(200,[],"no subscriber on this channel!!"))
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribers },
        "Subscribers fetched successfully!!"
      )
    );
});
