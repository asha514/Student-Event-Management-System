import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/users/register", {
        name,
        email,
        password,
      });

      setSuccess(response.data.message || "Account created. Redirecting to login...");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
            <h2>Create your account</h2>
            <p>Register to join events on campus.</p>
          </div>

          {error && <div className="banner banner-error">{error}</div>}
          {success && <div className="banner banner-success">{success}</div>}

          <form onSubmit={handleRegister}>
            <div className="field">
              <label className="field-label" htmlFor="name">Full name</label>
              <input
                id="name"
                className="input-premium"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-auth-premium" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/">Log in</Link>
          </p>
        </div>
      </main>

      <footer className="auth-footer">
        <p>&copy; {new Date().getFullYear()} EventHub. Built for students.</p>
      </footer>
    </div>
  );
}

export default Register;
