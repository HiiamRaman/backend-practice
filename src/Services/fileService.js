/*
import { uploadOnCloudinary } from "../utils/Cloudinary";
import ApiError from "../utils/apiError";
import fs from 'fs'

export const handleUserFile  =async(files)=>{

   try {
     const result = {};
//    it will look like this 
//    result = {
//    avatar: "https://cloudinary.com/avatar123",
//    coverImage: "https://cloudinary.com/cover456"
//     };   
 
 if(files?.avatar){  
     const uploaded = await uploadOnCloudinary(files?.avatar[0].path);
     if(!uploaded){throw new ApiError(400,"Failed to upload Avatar"); }

      // Cleanup local file
      fs.unlinkSync(files.avatar[0].path);

 // // Store uploaded avatar URL in result
 result.avatar = uploaded.secure_url ; 
 }
 if(files?.coverimage){
     const uploaded  = await uploadOnCloudinary(files?.coverimage[0].path)
     if (!uploaded) {
         throw new ApiError(400,"Failed to upload Coverimage");
         
     }

      // Cleanup local file
      fs.unlinkSync(files.coverimage[0].path);
     result.coverimage = uploaded.secure_url
 }
 return result
   } catch (error) {
    throw new  ApiError(500,"Failed to Upload image");
    
    
   }
}


*/