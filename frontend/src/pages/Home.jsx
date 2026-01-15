import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-cyan-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-400 rounded-full opacity-25 animate-ping"></div>
      </div>

      <div className="text-center max-w-2xl px-6 relative z-10">
        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
          Streamly
        </h1>

        <p className="text-xl text-white/90 mb-10 leading-relaxed">
          Your ultimate personal video streaming platform. Upload, stream, and enjoy videos with seamless HLS playback.
        </p>

        <div className="flex justify-center gap-6">
          <Link to="/signup">
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-purple-900 font-bold text-lg shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-yellow-400/50">
              Get Started
            </button>
          </Link>

          <Link to="/login">
            <button className="px-8 py-4 rounded-full border-2 border-white/50 text-white font-bold text-lg hover:bg-white/10 hover:border-white backdrop-blur-md shadow-2xl transform hover:scale-110 transition-all duration-300">
              Login
            </button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-2">🎥</div>
            <h3 className="font-semibold text-lg">Upload Videos</h3>
            <p className="text-sm text-white/80">Seamlessly upload and process your videos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-lg">Fast Streaming</h3>
            <p className="text-sm text-white/80">Adaptive bitrate for smooth playback</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-lg">Secure</h3>
            <p className="text-sm text-white/80">OTP-based authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
