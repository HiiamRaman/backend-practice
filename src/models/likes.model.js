import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedOnModel: {
      // What content is being liked (post, comment, video ...)
      type: String,

      enum: ["Post", "Comment", "Video"],
      required: true,
    },
    likedOn: {
      type: mongoose.Schema.ObjectId,
      ref: "likedOnModel",
      required: true,
    },
  },
  { timestamps: true }
);
export const Like = mongoose.model("Like", likeSchema);
