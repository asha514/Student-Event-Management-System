import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./RegistrationSuccess.css";
import generatePDF from "../utils/generatePDF";
import Navbar from "../components/Navbar";

function RegistrationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);

  const registration = location.state?.registration;
  const event = location.state?.event;

  useEffect(() => {
    if (event && registration) {
      setShowConfetti(true);
      // Confetti animation timer or trigger could go here
    }
  }, [event, registration]);

  if (!event || !registration) {
    return (
      <div className="page">
        <Navbar />
        <div className="success-shell" style={{ height: '60vh' }}>
          <div className="empty-state-premium" style={{ width: '100%' }}>
            <div className="empty-icon">🧐</div>
            <h3>Pass Not Found</h3>
            <p>We couldn't find the registration details you're looking for.</p>
            <button className="btn-pill primary" style={{ width: 'auto', marginTop: '16px' }} onClick={() => navigate("/events")}>
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const eventDateObj = new Date(event.date);
  const eventDate = eventDateObj.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  
  const regDateObj = registration.createdAt ? new Date(registration.createdAt) : new Date();
  const regDate = regDateObj.toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const isPast = eventDateObj < new Date();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I'm going to ${event.title}!`,
          text: `Join me at ${event.title} on ${eventDate}.`,
          url: window.location.origin + '/events'
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      alert("Sharing is not supported on this browser, but you can copy the link!");
    }
  };

  return (
    <div className="page success-page">
      <div className="success-bg-elements">
        <div className="success-blob-1"></div>
        <div className="success-blob-2"></div>
      </div>

      <Navbar />

      <div className="success-shell">
        <div className="success-container">
          
          {/* Animated Hero */}
          <div className="success-hero">
            <div className="success-icon-wrapper">
              <div className="success-pulse"></div>
              <div className="success-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <h1>🎉 <span>Registration Successful!</span></h1>
            <p>You have successfully registered for this event. We look forward to seeing you there!</p>
          </div>

          {/* Success Message Card */}
          <div className="success-message-card">
            <div className="message-icon">✅</div>
            <div className="message-content">
              <h3>Registration Confirmed</h3>
              <p>We've reserved your seat. Please arrive 15 minutes before the event starts to ensure smooth check-in.</p>
            </div>
          </div>

          {/* Premium Event Summary Card */}
          <div className="event-summary-card">
            <div className="summary-image">
              <img src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"} alt={event.title} />
              <div className="summary-overlay"></div>
              <div className="summary-badges">
                <span className="summary-badge-dept">{event.department || "General"}</span>
              </div>
            </div>
            
            <div className="summary-body">
              <h2>{event.title}</h2>
              
              <div className="summary-grid">
                <div className="summary-field">
                  <div className="summary-icon">📅</div>
                  <div className="summary-field-content">
                    <label>Event Date</label>
                    <span>{eventDate}</span>
                  </div>
                </div>
                
                <div className="summary-field">
                  <div className="summary-icon">⏰</div>
                  <div className="summary-field-content">
                    <label>Event Time</label>
                    <span>{event.time || "TBA"}</span>
                  </div>
                </div>
                
                <div className="summary-field">
                  <div className="summary-icon">📍</div>
                  <div className="summary-field-content">
                    <label>Venue</label>
                    <span>{event.location || "TBA"}</span>
                  </div>
                </div>
                
                <div className="summary-field">
                  <div className="summary-icon">🆔</div>
                  <div className="summary-field-content">
                    <label>Registration ID</label>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>#{registration._id.substring(0, 8).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-footer-grid">
                <div className="summary-field">
                  <div className="summary-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>👤</div>
                  <div className="summary-field-content">
                    <label>Registered As</label>
                    <span>{registration.name || "Student"}</span>
                  </div>
                </div>
                
                <div className="summary-field">
                  <div className="summary-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>🎟️</div>
                  <div className="summary-field-content">
                    <label>Booked On</label>
                    <span>{regDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="timeline-card">
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: 'var(--ink)' }}>Your Journey</h3>
            <div className="timeline">
              <div className="timeline-step completed">
                <div className="step-icon completed">✓</div>
                <span className="step-label">Registered</span>
              </div>
              <div className={`timeline-step ${!isPast ? 'active' : 'completed'}`}>
                <div className={`step-icon ${!isPast ? 'active' : 'completed'}`}>{!isPast ? '2' : '✓'}</div>
                <span className="step-label">Event Day</span>
              </div>
              <div className={`timeline-step ${isPast ? 'active' : ''}`}>
                <div className={`step-icon ${isPast ? 'active' : ''}`}>3</div>
                <span className="step-label">Participation</span>
              </div>
              <div className="timeline-step">
                <div className="step-icon">4</div>
                <span className="step-label">Certificate</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-grid">
            <button className="btn-pill primary action-row-full" onClick={() => generatePDF(registration, event)}>
              <span style={{ fontSize: '18px' }}>📥</span> Download Digital Pass
            </button>
            <button className="btn-pill secondary" onClick={() => navigate("/my-registrations")}>
              View My Passes
            </button>
            <button className="btn-pill secondary" onClick={handleShare}>
              Share Event
            </button>
            <button className="btn-pill outline action-row-full" onClick={() => navigate("/events")}>
              Browse More Events
            </button>
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

export default RegistrationSuccess;