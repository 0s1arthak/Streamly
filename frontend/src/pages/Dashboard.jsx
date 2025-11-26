import React from "react";

const Dashboard = () => {

  // Logout function
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Navigate to login page
    window.location.href = "/login"; 
    // (You can also use navigate() from react-router-dom if preferred)
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <button 
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
