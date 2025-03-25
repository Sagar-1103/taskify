import mongoose,{Document,Schema, Types} from "mongoose";

export interface ITask extends Document {
    title:string;
    description:string;
    userId:Types.ObjectId;
    status: "Pending" | "In Progress" | "Completed";
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema  = new Schema<ITask>({
    title:{
        type:String,
        trim: true,
        required:true,
    },
    description:{
        type:String,
        trim: true,
        required:true,
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true,
    }
},{
    timestamps:true,
})

export const Task = mongoose.model<ITask>("Task",taskSchema);