import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to Streamly</h1>
      <p>Your personal video platform.</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/signup">
          <button style={{ margin: "10px", padding: "10px 20px" }}>Sign Up</button>
        </Link>

        <Link to="/login">
          <button style={{ margin: "10px", padding: "10px 20px" }}>Login</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
