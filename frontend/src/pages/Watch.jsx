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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-purple-300 hover:text-purple-100 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300"
        >
          ← Back to Dashboard
        </button>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-lg">
          {video.title}
        </h1>

        {/* Video Player */}
        <div className="relative mb-8">
          <video
            ref={videoRef}
            controls
            className="w-full rounded-2xl bg-black shadow-2xl border border-purple-500/30"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
        </div>

        {/* Description */}
        {video.description && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-purple-300 mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">
              {video.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;
