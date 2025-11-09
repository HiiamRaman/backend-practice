// the first step is to connect mongodb atlas  and
//  where the tutor said that ' daatabse is always in another continent
//  so dont forget to use Async function '
import mongoose from "mongoose";
import dotenv from "dotenv";
import {DB_NAME} from "./constants.js";
// 1 . proffesional coding style
dotenv.config();
async function Connection() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI }/${DB_NAME}`);
    console.log("mongodb sucessfully connected!!!");
  } catch (error) {
    console.error("mongodb connection failure", error);
  }
}

Connection();
















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