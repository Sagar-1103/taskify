import { Request, Response } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { User } from "../models/user.model";
import ApiResponse from "../utils/ApiResponse";

export const signup = AsyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({ name, email, password });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export const login = AsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "Invalid user credentials");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  user.refreshToken = undefined;
  user.password = "";

  res
    .status(200)
    .json(
      new ApiResponse(
        201,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export const logout = AsyncHandler(async (req: Request, res: Response) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },  
        },
        { new: true }
    );
    
    res.status(200).json(new ApiResponse(200, {}, "User logged out"));
});

export const resetPassword = AsyncHandler(async (req: Request, res: Response) => {
  const {currentPassword,newPassword} = req.body;
  if(!currentPassword || !newPassword){
    throw new ApiError(400, "Both current and new passwords are required");
  }
  
  const user = await User.findById(req.user?._id);

  if(!user){
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect current password");
  }

  user.password = newPassword;

  await user.save({validateBeforeSave:false})

  res.status(200).json(new ApiResponse(200, {}, "Password updated Successfully"));
});
