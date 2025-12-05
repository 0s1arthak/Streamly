import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
  const navigate = useNavigate();
  const email = localStorage.getItem("signupEmail");
  useEffect(() => {
    const email = localStorage.getItem("tempEmail");
    if (!email) {
      navigate("/signup"); // user skipped signup → redirect
    }
  }, []);

  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP Verified Successfully!");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Verify OTP</h2>

      <p>OTP has been sent to: <b>{email}</b></p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      /><br />

      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
}

export default VerifyOtp;
