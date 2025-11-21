import { User } from "../models/user.model";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import asynchandler from "../utils/asynchandler";
import { uploadOnCloudinary } from "../utils/Cloudinary";
export const updateAvatarimage  = asynchandler(async(req,res)=>{
        const avatarPath = req.file?.path ; 
        if (!avatarPath) {
            throw new ApiError(400,"Avatarimage is reqiored");
            
        }
        //uploade on cloudinary
        const uploaded = await uploadOnCloudinary(avatarPath);
        if(!uploaded.secure_url && !uploaded.url){
            throw new ApiError(500,"failed to upload Avatar");
            
        }
        //  Cleanup temporary file
        fs.unlinkSync(avatarPath);

          const user = await User.findByIdAndUpdate(req.user._id,{
            avatar : uploaded.url || uploaded.secure_url
          },
        {new : true}).select('-password -refreshToken')
    return res.status(200).json(new ApiResponse(200,{user},"Avatar uploaded succesfully"))

})

export const  updateCoverimage = asynchandler(async(req, res)=>{
try {
    
    const coverimagepath = req.file?.path 
    if (!coverimagepath) {
        throw new ApiError(400,"coverimage not found");
        
        
    }
    //upload on cloudinary
    const uploaded = await uploadOnCloudinary(coverimagepath);
     if (!uploaded?.secure_url && !uploaded?.url) {
    throw new ApiError(500, "Failed to upload cover image");
  } 
  
     //update on database
     const user = await User.findByIdAndUpdate(req.user._id,{
        coverimage :   uploaded.secure_url || uploaded.url
     },
    {new : true}).select('-password -refreshToken')
    // cleanup temporary file
   try {
  fs.unlinkSync(coverimagepath);
} catch (cleanupErr) {
  console.log("File cleanup failed:", cleanupErr);
}

    
    return res.status(200).json(new ApiResponse(200,{user},'coverimage updated successfully'))
} catch (error) {
    console.log("Error : ",error)
    throw new ApiError(500,"something went wrong while updating coverimage");
    
}

})