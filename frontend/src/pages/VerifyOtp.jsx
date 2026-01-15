import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("signupEmail");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!email) navigate("/signup");
  }, []);

  const handleVerify = async () => {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-teal-500 to-blue-600">
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Verify OTP</h2>

        <p className="text-sm text-white/80 mb-8 text-center bg-white/10 backdrop-blur-md p-4 rounded-xl">
          OTP sent to <b className="text-yellow-300">{email}</b>
        </p>

        <input
          className="w-full mb-8 px-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-center text-2xl font-mono tracking-widest"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Verify OTP
        </button>

        <p className="text-center text-white/80 mt-6">
          Didn't receive OTP?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-pink-300 cursor-pointer hover:text-pink-200 font-semibold hover:underline transition-colors duration-300"
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
