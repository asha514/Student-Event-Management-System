import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const initial = user?.name?.[0]?.toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-brand-container">
          <Link to="/events" className="navbar-brand">
            <span className="navbar-mark">✨</span>
            <span className="brand-text">EventHub</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? "is-open" : ""}`}>
          <div className="navbar-links">
            <Link
              to="/"
              className={`navbar-link ${isActive("/") ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`navbar-link ${isActive("/events") ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/my-registrations"
              className={`navbar-link ${isActive("/my-registrations") ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Registrations
            </Link>
          </div>

          <div className="navbar-right">
            <button className="icon-btn notification-btn" aria-label="Notifications">
              🔔
            </button>
            <div className="navbar-user">
              <span className="navbar-avatar">{initial}</span>
              <span className="navbar-username">{user?.name || "User"}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        <button 
          className="hamburger-btn" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
