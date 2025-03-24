import app from "./app";
import dotenv from "dotenv";
import connectDatabase from "./config/database.config";
dotenv.config();

const port = process.env.PORT;

const startServer = async()=>{
    await connectDatabase();
    app.listen(port,()=>{
        console.log(`Server running on port ${port}`);
    })
}

startServer();