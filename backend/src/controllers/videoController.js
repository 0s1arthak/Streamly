import Video from "../models/Video.js";
import ffmpeg from "fluent-ffmpeg"
import path from "path"
import fs from "fs"
import { processVideo } from "../services/videoService.js";

// We will go step by step first we will only upload video and create a record in db for that video 
// Always keep in mind when we are saying we are saving video in db , it only means that we are storing
// the metadata about that video, like the thumbnail and videoUrl fields that are inside Video model
// they only store the file path from which they will be accessed , obviously we cannot store the whole
// video inside the db it will be a fool's move




// First process , when user uploads the file , middleware will add it inside /uploads/raw and it will 
// send file object just like this 
// It reads and extracts file from request before it reaches to controller, give it a name and stores inside
// uploads/raw/{videoName.mp4}
// {
//   path: 'uploads/raw/1703784523019-file.mp4',
//   filename: '1703784523019-file.mp4',
//   mimetype: 'video/mp4'
// }



// Controller will have access to raw path of file using req.file.path

export const videos=async(req,res)=>{
    const videos=await Video.find().sort({createdAt:-1});
    console.log(videos);
    res.json(videos);
}


export const uploadVideo=async(req,res)=>{
    try {
        const {title,description}=req.body;

        console.log(req.body)

        const userId=req.user._id;

        console.log(req.file)

        const rawPath=req.file.path;

        console.log(rawPath)



        // hls folder for video naming
        const videoId=Date.now().toString();

        const hlsFolder = path.join("uploads", "hls", videoId);
        const thumbPath = path.join("uploads", "thumbnails", `${videoId}.jpg`);


        fs.mkdirSync(hlsFolder, { recursive: true });


        const newVideo=await Video.create({
            title,
            description,
            user:userId,
            thumbnail:thumbPath,
            videoUrl:`${hlsFolder}/master.m3u8`,
            status:"processing"
        })

        // Process the video using service
        processVideo(rawPath,hlsFolder,thumbPath,newVideo._id);

        return res.status(200).json({message:"Uploaded. Processing started.",video:newVideo});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


export const getVideoById=async(req,res)=>{
    try {
        const video=await Video.findById(req.params.id);
        return res.json({video});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}