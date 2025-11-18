import mongoose from "mongoose";


const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    value:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        expires:300,
        default:Date.now
    },
})


export default mongoose.model("Otp",otpSchema);