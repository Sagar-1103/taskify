import mongoose,{Document,Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    refreshToken?:string;
    isPasswordCorrect: (password: string) => Promise<boolean>;
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
}

const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required:true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        index:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    }
},
{
    timestamps:true,
})

userSchema.methods.isPasswordCorrect = async function(password:string):Promise<boolean> {
    const isValid = await bcrypt.compare(password,this.password);
    return isValid; 
}

userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.generateAccessToken = function (): string {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY
      ? parseInt(process.env.ACCESS_TOKEN_EXPIRY)
      : 3600;
    if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");
    if (!expiresIn) throw new Error("ACCESS_TOKEN_EXPIRY is not defined");
    const payload: JwtPayload = {
      id: this._id.toString(),
      name: this.name,
      email:this.email,
    };
  
    const options: SignOptions = { expiresIn };
  
    const token = jwt.sign(payload, secret, options);
    return token;
  };
  
  userSchema.methods.generateRefreshToken = function (): string {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY
      ? parseInt(process.env.REFRESH_TOKEN_EXPIRY)
      : 604800;
    if (!secret) throw new Error("REFRESH_TOKEN_SECRET is not defined");
    if (!expiresIn) throw new Error("REFRESH_TOKEN_EXPIRY is not defined");
    const payload: JwtPayload = {
      id: this._id.toString(),
    };
  
    const options: SignOptions = { expiresIn };
    const token = jwt.sign(payload, secret, options);
    return token;
};

export const User = mongoose.model<IUser>("User",userSchema);