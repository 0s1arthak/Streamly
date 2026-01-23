import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { processVideo } from "../services/videoService.js";


new Worker("video-processing",async(job)=>{
    const { rawPath, hlsFolder, thumbPath, videoId } = job.data;
    console.log("Worker at work");
    await processVideo(rawPath, hlsFolder, thumbPath, videoId);
},
{
    connection:redis,
    concurrency:1
}


)