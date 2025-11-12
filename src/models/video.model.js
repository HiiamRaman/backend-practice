import mongoose, { Schema } from 'mongoose'

import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const videoSchema = new mongoose.Schema({


 videoFile:{
    type:String, //cloudinary url
    required:[true,'video is required'],


 },
 thumbnail:{
    type:String,
    required:true
 },
 title:{
    type:String,
    required:true
 },
 description:{
    type:String,
    required:true
 },
 duration:{
    type:Number, //cloudinary
    required:true
 },
 views:{
    type:Number,
    default:0
 },
 isPublished:{
    type:Boolean,
    default:true
 },
 videoOwner:{
    type:Schema.Types.ObjectId,
    ref: 'User'
 }





},{timestamps: true})




export const Video = mongoose.model('Video',videoSchema)