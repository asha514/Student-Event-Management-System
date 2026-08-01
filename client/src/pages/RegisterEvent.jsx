import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./registerEvent.css";
import API from "../services/api";
import Navbar from "../components/Navbar";

function RegisterEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.event;

  const [formData, setFormData] = useState({
    name: "",
    collegeName: "",
    year: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if accessed directly without event data
  useEffect(() => {
    if (!event) {
      navigate("/events");
    }
  }, [event, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || isSuccess) return;

    setLoading(true);

    try {
      const res = await API.post("/registrations", {
        eventId: event._id,
        ...formData,
      });

      setIsSuccess(true);
      
      // Keep showing "Registration Successful ✓" for a brief moment before navigating
      setTimeout(() => {
        navigate("/registration-success", {
          state: {
            registration: res.data.registration,
            event,
          },
        });
      }, 1000);
      
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
      setLoading(false);
    }
  };

  if (!event) return null;

  const eventDate = new Date(event.date).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="page">
      <Navbar />
      
      <div className="page-shell">
        <div className="checkout-container">
          <div className="checkout-sidebar">
            <div className="event-summary-card">
              <span className="eyebrow">You're registering for</span>
              <h2>{event.title}</h2>
              <div className="summary-meta">
                <p><span>📅</span> {eventDate}</p>
                <p><span>📍</span> {event.location}</p>
                <p><span>🏢</span> {event.department}</p>
              </div>
            </div>
          </div>

          <div className="checkout-main">
            <div className="form-card-premium">
              <div className="form-header">
                <h3>Attendee Details</h3>
                <p>Please enter your information exactly as it appears on your ID.</p>
              </div>

              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-row">
                  <div className="field">
                    <label className="field-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="input-premium"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label className="field-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="input-premium"
                      placeholder="jane@college.edu"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label className="field-label">College Name</label>
                    <input
                      type="text"
                      name="collegeName"
                      className="input-premium"
                      placeholder="University Institute of Tech"
                      value={formData.collegeName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label className="field-label">Year of Study</label>
                    <select
                      name="year"
                      className="input-premium select-premium"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="input-premium"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className={`btn-auth-premium ${isSuccess ? 'success' : ''}`} 
                    disabled={loading || isSuccess}
                    style={isSuccess ? { background: '#10b981', borderColor: '#10b981' } : {}}
                  >
                    {loading && !isSuccess && <span className="spinner" />}
                    {isSuccess ? "Registration Successful ✓" : (loading ? "Registering..." : "Confirm Registration")}
                  </button>
                  <p className="secure-text">🔒 Your data is secure and encrypted.</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer-premium">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">✨ EventHub</span>
            <p className="footer-desc">
              Discover, register, and experience the best technical and cultural events at your college. Built with ❤️ for students.
            </p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/events">Events</a></li>
              <li><a href="/my-registrations">My Registrations</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>📧 ashababu.dev@gmail.com</p>
            <p>📞 +91 - 6380535754</p>
            <div className="footer-social">
              <span className="social-icon">🐦</span>
              <span className="social-icon">📸</span>
              <span className="social-icon">💼</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EventHub Registration System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default RegisterEvent;