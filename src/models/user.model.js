import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, //cloudinary URL
    },
    coverimage: {
      type: String, //cloudinary URL
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },
    watchHistory: [
      {
        type: Schema.Types.Objectid,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// The Purpose
// Here, we want to encrypt (hash) the password before saving it to the database —
// so plain text passwords are never stored.
userSchema.pre("save", async function (next) {
  //basically  this method will keep changing the password if a user makes any changes to prevent this we have to add a condition so encrypt the password only if the password is updated
  if (!this.isModified(password)) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
}); // pre  also called middleware which is hook which just execute before saving

// we also have to compare passwords after hashing like if user refresh or login

// Once a password is hashed, you can’t “see” the original password again.
// So when a user logs in, we compare the entered password with the hashed one stored in the database.

// ### You can make password comparison easier by adding a custom method inside your schema:

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//lets generate access token

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//lets generate refresh token  its same as access token

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.REFRESH_TOKEN,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
