import mongoose from "mongoose";
const sessionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    role:{
        type:"string",
        required:true,
    },
    type:{
        type:"String",
        required:true

    },
    questions:{type:[String],default:[]},
    answers:[String],
    feedback:[String],
    scores:[Number],
    overallScores:Number,


},{timestamps:true})
const Session=mongoose.model("Session",sessionSchema);
export default Session