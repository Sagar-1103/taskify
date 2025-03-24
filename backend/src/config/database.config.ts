import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDatabase = async()=>{
    try {
        const mongoConnection = await mongoose.connect(`${process.env.MONGODB_URI}/taskify`);
        console.log("Database Connected : ",mongoConnection.connection.host);
    } catch (error) {
        console.log("Error connecting database");
        process.exit(1);
    }
}

export default connectDatabase;