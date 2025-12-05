import express from "express"
import Video from "../models/Video.js";
import authMiddleware from "../middleware/authmiddleware.js";
import { uploadVideo,getVideoById,videos } from "../controllers/videoController.js"
import { upload } from "../middleware/upload.js";

const router=express.Router();


router.post("/upload",authMiddleware,upload,uploadVideo);

router.get("/",videos)
router.get("/:id",getVideoById);

export default router