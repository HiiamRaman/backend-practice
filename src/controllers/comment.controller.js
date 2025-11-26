import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler";
import { ApiError } from "next/dist/server/api-utils";
import { Video } from "../models/video.model";
export const createComment  = asynchandler(async(req,res)=>{
       

    const  {content} = req.body;
    const {videoID} = req.params

//Validate User authentication
    if(!req.user?._id){
throw new ApiError(401,"please login first");

    }
    //Validate comment Content
    if (!content || !content.trim()){
        throw new ApiError(404,"Content is required");
        
    }
    //Validate VideoId
    if(!mongoose.Types.ObjectId.isValid(videoID)){
        throw new ApiError (404,"Invalid VideoID")
    }
    //Check if the video exists
   const video = await Video.findById(videoID)
   if(!video){throw new ApiError(404,"Video not found");
   }
//Create comment 
const comment  = await Comment.create({
    content,
    video:videoID,
    owner:req.user._id
})

// optional: populate owner info for response
  await comment.populate('owner', 'name avatarUrl');
  return res.status(200,data="comment","Commented successfully");

    
})