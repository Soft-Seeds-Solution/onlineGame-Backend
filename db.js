import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const mongoDBUrl = process.env.MongoDb_Url
const connectToMongoDb = () => {
    try {
        mongoose.connect(mongoDBUrl)
        console.log("Successfully connected with mongodb");

    } catch (error) {
        console.log(error);
        process.exit()
    }
}

export default connectToMongoDb;