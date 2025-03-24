import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

declare module "express-serve-static-core" {
    interface Request {
      user?: any;
    }
  }
  

export const verifyJwt = AsyncHandler(async (req: Request, _: Response, next: NextFunction) => {
      try {
        const token = req.cookies?.accessToken || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
  
        if (!token) {
          throw new ApiError(401, "Unauthorized request");
        }
  
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
          throw new ApiError(500, "ACCESS_TOKEN_SECRET is not defined");
        }
  
        const decodedToken = jwt.verify(token, secret) as { id: string };
  
        if (!decodedToken?.id) {
          throw new ApiError(401, "Invalid Access Token");
        }
  
        const user = await User.findById(decodedToken.id).select(
          "-password -refreshToken"
        );
        if (!user) {
          throw new ApiError(401, "User not found");
        }
  
        req.user = user;
        next();
      } catch (error: any) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
      }
    }
  );