import dotenv from 'dotenv'
dotenv.config(); 
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  //cloudinary config
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//console.log("Cloudinary config:", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY ? "OK" : "Missing");

// cloudinary file upload code

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("file path not found!!");
      return null;
    }
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete temp file after success  (no images will be saved in your public/temp )

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.log("File uploaded  sucessfully!!!", result.secure_url);
    return result;
  } catch (error) {
    // now we have to ctach the failed files while uploading and delete it from our server which is stored temporarily

    //  we use fs to unlink

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.log("Failed to upload", error);
    return null;
  }
};
