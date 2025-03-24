import { Request, Response, NextFunction } from "express";
import ApiResponse from "./ApiResponse.js";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

interface ErrorTypes extends Error {
    statusCode?:number; 
}

const AsyncHandler = (fn: AsyncFunction) => async(req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            const err = error as ErrorTypes;
            res.status(err.statusCode || 500).json(
                new ApiResponse(err.statusCode || 500, undefined, err.message)
            );
        }
};

export default AsyncHandler;
