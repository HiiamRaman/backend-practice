import ApiResponse from "../utils/apiResponse.js";
import asynchandler from "../utils/asynchandler.js";

export const healthCheck  =  asynchandler(async(req,res)=>{

return res.status(200).json(new ApiResponse(200,{ status: "ok",
    uptime: process.uptime(),
    timestamp: new Date()},"good"))


})