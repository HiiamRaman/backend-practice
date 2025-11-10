// the first step is to connect mongodb atlas  and
//  where the tutor said that ' daatabse is always in another continent
//  so dont forget to use Async function '
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

// 1.clean approach of connection of mongodb
import express from "express";
import dotenv from "dotenv";
import { mongoConnection } from "./db/index.js";

dotenv.config();

const app = express();

// app.listen(process.env.PORT, () => {
//   console.log(`PORT is listening on ${process.env.PORT}`);
// });

//  Register error listener BEFORE server starts
app.on("error", (error) => {
    console.log("Eror occured !!!!", error);
    throw error;
  })

mongoConnection().then(() => {


    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `mongo DB connection is succesfully connected !!! ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("mogoDb connection failed !!!", error);
  });

// not going to use this approach because this makes the file messy better we create another file which is db/index.js
// 1 . proffesional coding style
/* dotenv.config();
const app  = express()
async function Connection() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI }/${DB_NAME}`);
    app.on("Error",(error)=>{
      console.log("database connection Error",error);
      throw  error
      
      
    })
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("mongodb connection failure", error);
  }
}

Connection();




*/

//2. it can be done also by without using constants.js

//      import mongoose from "mongoose"
//      import dotenv from 'dotenv'

// dotenv.config()
//      async function Connection (){

//         try {
//            const result =  await mongoose.connect (process.env.MONGODB_URI)
//           console.log("connection sucess and Database results",result);

//         } catch (error) {
//           console.error("database connection failed")

//         }

//      }
// Connection()
