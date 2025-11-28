import mongoose from "mongoose";


const videoSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    thumbnail:{
        type:String,
    },
    videoUrl: String,
    status: { type: String, default: "processing" },

},{ timestamps: true })

export default mongoose.model("Video",videoSchema);