import { Request, Response } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { Task } from "../models/task.model";
import ApiResponse from "../utils/ApiResponse";

export const createTask = AsyncHandler(async(req:Request,res:Response)=>{
    const { title, description } = req.body;
    const userId = req.user?._id;

    if (!title || !description) {
        throw new ApiError(400, "All fields are required");
    }

    const task = await Task.create({ title, description, userId });

    if(!task){
        throw new ApiError(500, "Error creating task");
    }

    res.status(201).json( new ApiResponse(201,{task},"Task created successfully"));
})

export const getTasks = AsyncHandler(async(req:Request,res:Response)=>{
    const userId = req.user?._id;
    const tasks = await Task.find({ userId });
    res.status(200).json({
        success: true,
        tasks,
    });
})

export const getTask = AsyncHandler(async(req:Request,res:Response)=>{
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    res.status(200).json(new ApiResponse(200,{task},"Task fetched successfully"));
})

export const updateTask = AsyncHandler(async(req:Request,res:Response)=>{
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "All fields are required");
    }

    const task = await Task.findByIdAndUpdate(
        id,
        { title, description },
        { new: true, runValidators: true }
    );

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json(new ApiResponse(200,{task},"Task updated successfully"));
})

export const deleteTask = AsyncHandler(async(req:Request,res:Response)=>{
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json(new ApiResponse(200,{},"Task deleted successfully"));
})
