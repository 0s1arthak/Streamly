import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 to-purple-700 text-white">
      <div className="text-center max-w-xl px-6">
        <h1 className="text-5xl font-bold mb-4">
          Streamly
        </h1>

        <p className="text-lg text-indigo-100 mb-8">
          Your personal video streaming platform.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/signup">
            <button className="px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-100 transition">
              Sign Up
            </button>
          </Link>

          <Link to="/login">
            <button className="px-6 py-3 rounded-lg border border-white hover:bg-white hover:text-indigo-600 transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
