import mongoose from "mongoose";
const playlistSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    videos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: true,
     
    }],
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
export const Playlist = mongoose.model("Playlist", playlistSchema);
