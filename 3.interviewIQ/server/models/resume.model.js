import mongoose from "mongoose";


const resumeSchema = new mongoose.Schema(
    {
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
     },
     jopTittle:{
        type:String,
        required: true,

     },
     resumeText:{
        type:String,
        required: true,
     },
     isDeleted:{
        type:Boolean,
        default:false,
     },

    },
    { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;