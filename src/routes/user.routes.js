import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";// multerconfig is where we configured multer

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

router.route("/register").post(
  upload.fields([ // basically its middleware where multer handling uploads
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
export default router;
 // upload.fields(...)

      //This comes from Multer, a popular middleware for handling file uploads in Express
