import mongoose from "mongoose";
const tweetSchema  = new mongoose.Schema({
  

    owner :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    // Main text of the tweet
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280, // like Twitter
    },


},{timestamps:true});
export const Tweet = mongoose.model("Tweet",tweetSchema)