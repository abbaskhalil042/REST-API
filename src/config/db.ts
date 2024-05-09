import mongoose, { mongo } from "mongoose";
import { config } from "./config";
const connectDB = async () => {
  try {
  

    mongoose.connection.on("connected", () => {
      console.log("connected successfully");
    });

    //&if error
    mongoose.connection.on("error", (err) => {
      console.log("error while connecting to database", err);
    });

    await mongoose.connect(config.databaseURL as string);
  } catch (error) {
    console.log("failed to connect to databse ", error);
    process.exit(1); //stop the server if there is error
  }
};

export default connectDB;
