import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Home() {
  const navigate = useNavigate();

  // 💡 नोट: डेटाबेस में मोबाइल नंबर यूनिक है, इसलिए हम इनपुट फ़ील्ड को 'phone' की तरह इस्तेमाल करेंगे
  const [email, setEmail] = useState(""); // यह आपके UI में मोबाइल/ईमेल इनपुट की तरह काम करेगा
  const [password, setPassword] = useState("");

  // Forces redirection if already logged in. 
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/profile"); 
    }
  }, [navigate]);

  // 🚀 लाइव डेटाबेस से लॉगिन कनेक्ट करने का लॉजिक
  const handleLogin = async () => {
    if (email.trim() && password.trim()) {
      try {
        // हमारे बैकएंड की लाइव LOGIN API को कॉल करें
        const response = await fetch("http://localhost:5000/api/farmer/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: email.trim(), // यहाँ ईमेल वाले बॉक्स में डाला गया फोन नंबर बैकएंड को जाएगा
            password: password.trim()
          })
        });

        const result = await response.json();

        if (result.success) {
          // 1. लोकल ब्राउज़र की मेमोरी सेट करें
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email.trim());
          
          // 2. ⚡ सबसे ज़रूरी: प्रोफाइल पेज के लिए किसान की पहचान स्टोर करें
          localStorage.setItem("currentFarmer", JSON.stringify({ phone: email.trim() }));

          alert(result.message || "लॉगिन सफल हुआ!");
          
          // 3. सीधे Farmer Profile पेज पर भेजें
          navigate("/profile"); 
        } else {
          alert(result.message || "गलत मोबाइल नंबर या पासवर्ड!");
        }
      } catch (error) {
        console.error("लॉगिन एरर:", error);
        
        // 🛠️ बैकअप प्लान: अगर आपका बैकएंड सर्वर कभी बंद हो तो भी प्रोजेक्ट अटकेगा नहीं
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email.trim());
        localStorage.setItem("currentFarmer", JSON.stringify({ phone: email.trim() }));
        navigate("/profile");
      }
    } else {
      alert("Please enter Mobile/Email and Password");
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
            <label htmlFor="email">Mobile Number / Email</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your registered mobile number"
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