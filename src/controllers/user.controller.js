import asynchandler from "../utils/asynchandler.js";
export const userRegister = asynchandler(async(req,res)=>{
    res.status(200).json({
        message : 'hello!!!'
    })
})