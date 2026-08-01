import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your details and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <main className="auth-main">
        <div className="auth-card-premium">
          <div className="auth-header">
            <span className="auth-logo">✨ EventHub</span>
            <h2>Welcome back</h2>
            <p>Enter your details to continue to your events.</p>
          </div>

          {error && <div className="banner banner-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input-premium"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input-premium"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-auth-premium" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </main>

      <footer className="auth-footer">
        <p>&copy; {new Date().getFullYear()} EventHub. Built for students.</p>
      </footer>
    </div>
  );
}

export default Login;
