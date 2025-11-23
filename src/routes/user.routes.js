import { Router } from "express";
import {
  loginUser,
  userRegister,
  logoutUser,
  refreshAccessToken
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; // multerconfig is where we configured multer
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { updateCoverimage } from "../controllers/image.controlelr.js";
import { updateAvatarimage } from "../controllers/image.controlelr.js";
import { updateEmail } from "../controllers/updateEmail.controller.js";
const router = Router();
/*
Flow:

Client sends a multipart/form-data POST request with:

name, email, password (text fields)
  now you can upload images 
avatar and coverimage (files)

Multer parses the files and saves them (in memory or disk, depending on your setup)

The parsed data is available in your controller:
*/
// Route for Registration
router.route("/register").post(
  upload.fields([
    // basically its middleware where multer handling uploads
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  userRegister
);

router.route("/login").post(loginUser);

// secured route

// Route for logout (secured route)  injecting  authmiddleware

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh").post(refreshAccessToken)

router.route("/coverimage").patch(verifyJWT ,upload.single("coverimage"), updateCoverimage)
router.route("/avatarimage").patch(verifyJWT ,upload.single("avatar") ,updateAvatarimage)
//updateEmail route
router.route("/updateEmail").put(verifyJWT,updateEmail)
//getCurrentUser route
export default router;
// upload.fields(...)

//This comes from Multer, a popular middleware for handling file uploads in Express
