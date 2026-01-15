import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
      <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">Login</h2>

        <input
          className="w-full mb-6 px-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          className="w-full mb-8 px-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Login
        </button>

        <p className="text-center text-white/80 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-yellow-300 cursor-pointer hover:text-yellow-200 font-semibold hover:underline transition-colors duration-300"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
