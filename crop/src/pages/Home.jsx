import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Home() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forces redirection if already logged in. 
  // To stay on this page, clear your browser localStorage or use the Logout button!
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = () => {
    if (email.trim() && password.trim()) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email.trim());
      navigate("/dashboard");
    } else {
      alert("Please enter Email and Password");
    }
  };

  // Allows user to press 'Enter' on their keyboard to log in
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">

        {/* Left Side */}
        <div className="info-section">
          <h1>🌾 AgroSmart AI</h1>

          <p className="tagline">
            Smart Farming For Better Tomorrow
          </p>

          <p className="description">
            AgroSmart AI is an intelligent farming platform that helps
            farmers make better decisions using Artificial Intelligence.
            Monitor crops, detect diseases, analyze soil conditions and
            improve productivity through smart farming solutions.
          </p>

          <div className="features">
            <div className="feature-card">
              <h3>🌱 Crop Recommendation</h3>
              <p>Get suitable crop suggestions based on soil conditions.</p>
            </div>

            <div className="feature-card">
              <h3>🔍 Disease Detection</h3>
              <p>Upload crop images and detect diseases instantly.</p>
            </div>

            <div className="feature-card">
              <h3>🌦 Weather Updates</h3>
              <p>Track weather conditions for better farming decisions.</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h2>Login</h2>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          <div className="forgot-password">
            <span
              onClick={() =>
                alert(
                  "Password reset feature will be connected with backend soon."
                )
              }
            >
              Forgot Password?
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;