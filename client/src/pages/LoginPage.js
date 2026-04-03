import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
      login(res.data);
      if (!isLogin) {
        navigate("/profile-setup");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div className="login-page">
      <div className="auth-card">
        <div className="auth-ornament">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20"></path>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <h2>{isLogin ? "Welcome Back" : "Begin Your Journey"}</h2>
        <p className="auth-subtitle">
          {isLogin
            ? "Step back into the realm of timeless compositions"
            : "Join a community dedicated to the soul of music"}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="auth-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="auth-input"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? "Enter Sanctuary" : "Initialize Journey"}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? "New to the experience? " : "Returning seeker? "}
          <span
            className="auth-toggle"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
