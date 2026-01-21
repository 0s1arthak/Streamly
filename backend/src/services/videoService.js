import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import Video from "../models/Video.js";
import { deleteCache } from "../utils/cache.js";

// UTIL — Run ffmpeg and return a Promise
const runFFmpeg = (command) => {
    return new Promise((resolve, reject) => {
        command.on("end", resolve).on("error", reject).run();
    });
};

export const processVideo = async (rawPath, hlsFolder, thumbPath, videoId) => {
    try {
        // 1) Ensure folders exist
        fs.mkdirSync(hlsFolder, { recursive: true });
        fs.mkdirSync(path.dirname(thumbPath), { recursive: true });

        console.log("📌 Starting video processing...");

        // 2) Generate Thumbnail
        await new Promise((resolve, reject) => {
            ffmpeg(rawPath)
                .on("end", resolve)
                .on("error", reject)
                .screenshots({
                    timestamps: ["50%"],
                    filename: path.basename(thumbPath),
                    folder: path.dirname(thumbPath),
                });
        });

        console.log("📌 Thumbnail generated");

        // 3) Build video qualities (sequential → stable)
        const qualities = [
            { name: "360p", width: 640, height: 360 },
            { name: "480p", width: 854, height: 480 },
            { name: "720p", width: 1280, height: 720 },
        ];

        for (const q of qualities) {
            console.log(`📌 Processing ${q.name}`);

            const command = ffmpeg(rawPath)
                .size(`${q.width}x${q.height}`)
                .addOptions([
                    "-profile:v baseline",
                    "-level 3.0",
                    "-start_number 0",
                    "-hls_time 6",
                    "-hls_list_size 0",
                    "-f hls"
                ])
                .output(`${hlsFolder}/${q.name}.m3u8`)
                .outputOptions([
                    `-hls_segment_filename`,
                    `${hlsFolder}/${q.name}_%03d.ts`,
                ]);

            await runFFmpeg(command);
        }

        console.log("📌 All HLS qualities generated");

        // 4) Master playlist
        const masterPlaylist = `
            #EXTM3U
            #EXT-X-VERSION:3
            #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
            360p.m3u8
            #EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
            480p.m3u8
            #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
            720p.m3u8
            `;

        fs.writeFileSync(`${hlsFolder}/master.m3u8`, masterPlaylist.trim());

        console.log("📌 Master playlist created");

        // 5) Update DB → mark ready
        await Video.findByIdAndUpdate(videoId, { status: "ready" });

        console.log("Processing finished successfully");

        deleteCache("videos:")
    } catch (err) {
        console.error("Video processing failed:", err);
        await Video.findByIdAndUpdate(videoId, { status: "failed" });
    }
};
