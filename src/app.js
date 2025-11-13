import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // credentials allows  sending cookies or token  especially for verification
  })
);
app.use(express.json({ limit: "10kb" }));
//It enables Express to automatically parse JSON data that comes in an HTTP request body.

// So yes — it lets your app directly access JSON, but through req.body

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public")); // this line means Hey Express, whenever someone requests a file that exists in this folder, just send it directly
app.use(cookieParser())

//import  routes 
import userRouter  from './routes/user.routes.js'
app.use('/api/v1/user',userRouter)





