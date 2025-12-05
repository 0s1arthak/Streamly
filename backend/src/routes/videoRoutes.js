import express from "express"
import Video from "../models/Video.js";
import authMiddleware from "../middleware/authmiddleware.js";
import { uploadVideo } from "../controllers/videoController.js"
import { upload } from "../middleware/upload.js";

const router=express.Router();


router.post("/upload",authMiddleware,upload,uploadVideo);

router.get("/",async(req,res)=>{
    const videos=await Video.find().sort({createdAt:-1});
    console.log(videos);
    res.json(videos);
})

export default router