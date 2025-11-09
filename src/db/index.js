import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export async function mongoConnection() {
  try {
    const responseMongoose = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      "MongoDb connection success!!!!",
      responseMongoose.connection.name
    );
    // to access host nameuse (onseMongoose.connection.host)
    //to access connection name use responseMongoose.connection.name
  } catch (error) {
    console.log("Mongodb connection is Failed!!", error);
    process.exit(1);

    //this is mostly used for the immediately exit of node.js program
  }
}
