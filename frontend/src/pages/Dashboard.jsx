import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/videos");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      }
    };

    fetchVideos();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
          Dashboard
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/upload")}
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Upload Video
          </button>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-white text-xl font-semibold drop-shadow-lg">
            No videos uploaded yet
          </p>
          <p className="text-white/70 mt-2">
            Start by uploading your first video!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {videos.map((video) => (
            <div
              key={video._id}
              onClick={() => navigate(`/watch/${video._id}`)}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-indigo-500/20 transform hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={`http://localhost:5000/${video.thumbnail}`}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl"></div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg text-white truncate drop-shadow-md">
                  {video.title}
                </h3>
                <p className="text-white/70 mt-2 text-sm">
                  Click to watch
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
