import mongoose from "mongoose";
const mongooseSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    videos:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }


  },
  { timestamps: true }
);
export const Comment = mongoose.model("Comment", mongooseSchema);
