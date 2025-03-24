import express,{Express, Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import ApiResponse from "./utils/ApiResponse";
import authRouter from "./routes/auth.route";
import tasksRouter from "./routes/task.route";
dotenv.config();

const app:Express = express();

app.use(express.json());
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json(new ApiResponse(200,{status:"running"},"Taskify backend is running..."))
})

app.use("/auth",authRouter);
app.use("/tasks",tasksRouter)

export default app;