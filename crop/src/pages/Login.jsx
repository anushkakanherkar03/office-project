import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await signup({ email, password, full_name: fullName });
        setLoading(false);
        setIsRegistering(false); // Switch to login mode
        setPassword(""); // Clear password field
        alert("Registration successful! Please login with your credentials.");
      } else {
        await login({ email, password });
        setLoading(false);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isRegistering ? "Sign Up" : "Login"}</h2>

        <form onSubmit={handleAuth} style={styles.form}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Please wait..." : isRegistering ? "Sign Up" : "Login"}
          </button>
        </form>

        <p 
          onClick={() => { setIsRegistering(!isRegistering); setError(""); }} 
          style={{ cursor: "pointer", color: "blue", marginTop: "16px", fontSize: "14px" }}
        >
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4",
  },
  card: {
    width: "320px",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "12px",
  },
};

export default Login;