import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LIMIT = 8;

const Dashboard = () => {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        search,
      });

      const res = await fetch(
        `http://localhost:5000/api/videos?${params.toString()}`
      );

      const data = await res.json();

      setVideos(data.videos);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, search]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none"
          />

          <button
            onClick={() => navigate("/upload")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Upload
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-white text-center mt-20">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-white text-center mt-20">
          No videos found
        </p>
      ) : (
        <>
          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {videos.map((video) => (
              <div
                key={video._id}
                onClick={() => navigate(`/watch/${video._id}`)}
                className="bg-white/10 backdrop-blur-lg rounded-2xl cursor-pointer hover:scale-105 transition-all"
              >
                <img
                  src={`http://localhost:5000/${video.thumbnail}`}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />

                <div className="p-4">
                  <h3 className="text-white font-semibold truncate">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded bg-white/20 text-white disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-white">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded bg-white/20 text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
