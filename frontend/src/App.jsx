import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Upload from "./pages/Upload";
import Watch from "./pages/Watch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
        } />
        <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
        } />
        <Route path="/verify-otp" element={
          <PublicRoute>
            <VerifyOtp />
          </PublicRoute>
        } />
        <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
        } />
        <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
        }/>
        <Route path="/upload" element={
          <PrivateRoute>
            <Upload/>
          </PrivateRoute>
        }/>
        <Route path="/watch/:id" element={
          <PrivateRoute>
            <Watch/>
          </PrivateRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
