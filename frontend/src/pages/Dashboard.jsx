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
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <p className="text-gray-600">No videos uploaded yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                if (video.status === "ready") {
                  navigate(`/watch/${video._id}`);
                }
              }}
            >
              {/* Thumbnail */}
              <img
                src={`http://localhost:5000/${video.thumbnail}`}
                alt={video.title}
                className="w-full h-40 object-cover rounded-t"
              />

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">
                  {video.title}
                </h3>

                <p
                  className={`mt-2 text-sm font-medium ${
                    video.status === "ready"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {video.status === "ready"
                    ? "Ready to watch"
                    : "Processing..."}
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
