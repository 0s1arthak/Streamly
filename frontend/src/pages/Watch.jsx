import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hls from "hls.js";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/videos/${id}`);
        const data = await res.json();

        if (!res.ok || data.video.status !== "ready") {
          navigate("/dashboard");
          return;
        }

        setVideo(data.video);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/dashboard");
      }
    };

    fetchVideo();
  }, [id, navigate]);

  // Setup HLS + autoplay
  useEffect(() => {
    if (!video) return;

    const videoEl = videoRef.current;
    const videoSrc = `http://localhost:5000/${video.videoUrl}`;

    videoEl.muted = true;     // 🔑 REQUIRED for autoplay
    videoEl.autoplay = true;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(videoEl);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoEl.play().catch(() => {});
      });

      return () => hls.destroy();
    } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
      videoEl.src = videoSrc;
      videoEl.play().catch(() => {});
    }
  }, [video]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading video...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center gap-2 text-gray-300 hover:text-white"
        >
          ← Back to Dashboard
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">
          {video.title}
        </h1>

        {/* Video Player */}
        <video
          ref={videoRef}
          controls
          className="w-full rounded-lg bg-black"
        />

        {/* Description */}
        {video.description && (
          <p className="mt-4 text-gray-400">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Watch;
