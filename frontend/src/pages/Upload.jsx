import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !video) {
      setError("Title and video file are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      navigate("/dashboard");
    } catch (err) {
      if (err.message === "Unauthorized") {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/30">
        
        <h1 className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg">
          Upload Video
        </h1>

        {error && (
          <div className="mb-6 bg-red-500/20 backdrop-blur-md text-red-100 text-sm text-center p-4 rounded-2xl border border-red-400/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white drop-shadow-md">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
              placeholder="Enter video title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white drop-shadow-md">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 resize-none"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          {/* Video file */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white drop-shadow-md">
              Video File
            </label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                className="w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 transition-all duration-300"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ${
              loading
                ? "bg-gray-400/50 cursor-not-allowed backdrop-blur-md"
                : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
            }`}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full text-sm text-white/80 hover:text-white hover:underline mt-4 transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
