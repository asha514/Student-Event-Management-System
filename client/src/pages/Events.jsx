import { useEffect, useState, useMemo, useCallback, memo } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./Events.css";
import { useNavigate } from "react-router-dom";


// Custom Countdown Hook (Isolated)
const useCountdown = (targetDate) => {
  const countDownDate = useMemo(() => targetDate ? new Date(targetDate).getTime() : 0, [targetDate]);
  const [countDown, setCountDown] = useState(() => countDownDate ? countDownDate - new Date().getTime() : -1);

 useEffect(() => {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  reveals.forEach((el) => observer.observe(el));

  return () => {
    reveals.forEach((el) => observer.unobserve(el));
  };
}, []); [countDownDate];

  if (countDown < 0 || !countDownDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, isPast: false };
};

// Isolated Micro-Component for Countdown Badge (Prevents EventCard Re-renders)
const EventCountdownBadge = memo(({ targetDate }) => {
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetDate);
  if (isPast) return null;
  return (
    <div className="event-countdown-badge">
      <span className="live-dot"></span>
      Starts in: {days}d {hours}h {minutes}m {seconds}s
    </div>
  );
});

// Animated Counter Component
const AnimatedCounter = memo(({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end || 0)));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);
  return <>{count}</>;
});

// Memoized Event Card Component (Defined Outside Parent to Prevent Re-creation)
const EventCard = memo(({ event, registeringId, onShare, onNavigate }) => {
  if (!event) return null;

  const isOpen = (event.capacity ?? 1) > 0;
  const isRegistering = registeringId === event._id;

  return (
    <div className="event-card-premium">
      <div className="event-card-image">
        <img
          src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"}
          alt={event.title || "Event"}
        />
        <div className="event-badges-top">
          {event.department && <span className="badge-dept">{event.department}</span>}
          <span className={`badge-status ${isOpen ? "open" : "closed"}`}>
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>
        <EventCountdownBadge targetDate={event.date} />
      </div>

      <div className="event-card-body">
        <h3 className="event-title">{event.title || "Untitled Event"}</h3>
        <p className="event-desc">
          {(event.description || "No description available.").substring(0, 100)}
          {(event.description || "").length > 100 ? "..." : ""}
        </p>

        <div className="event-meta-grid">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span className="meta-text">
              {event.date ? new Date(event.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "TBA"}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span className="meta-text">{event.location || "TBA"}</span>
          </div>
        </div>
      </div>

      <div className="event-card-footer">
        <div className="footer-actions">
          <button
            className="icon-btn-secondary"
            onClick={() => onShare && onShare(event)}
            aria-label="Share event"
            title="Share"
          >
            🔗
          </button>
        </div>
        <button
          className={`btn-register-premium ${!isOpen ? "disabled" : ""}`}
          disabled={!isOpen || isRegistering}
          onClick={() => onNavigate && onNavigate(event)}
        >
          {isRegistering ? "..." : isOpen ? "Register Now" : "Registration Closed"}
        </button>
      </div>
    </div>
  );
});

const Events = () => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [registeringId, setRegisteringId] = useState(null);
  
  // Newsletter state & handlers
  const [newsletterEmail, setNewsletterEmail] = useState('');
const [subscribing, setSubscribing] = useState(false);

const handleNewsletterSubmit = async (e) => {
  e.preventDefault(); // form default submit stop pannanum
  if (!newsletterEmail) return;
  setSubscribing(true);
  try {
    const res = await fetch('http://localhost:5000/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsletterEmail })
    });
    const data = await res.json();
    alert(data.message); // illa oru msg state vachi kaatalam
    if (res.ok) setNewsletterEmail('');
  } catch (err) {
    alert('Error, try again');
  } finally {
    setSubscribing(false);
  }
};

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Toast Function
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // Department definitions
  const departments = useMemo(() => [
    {
      displayName: "CSE",
      value: "Computer Science",
      desc: "AI, Web Dev, Coding Contests & Hackathons",
      icon: "💻",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    },
    {
      displayName: "IT",
      value: "Information Technology",
      desc: "Cybersecurity, Cloud & Data Science",
      icon: "🌐",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    },
    {
      displayName: "ECE",
      value: "Electronics & Communication",
      desc: "Robotics, IoT & Embedded Systems",
      icon: "⚡",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },
    {
      displayName: "EEE",
      value: "Electrical & Electronics",
      desc: "Power Systems & Automation",
      icon: "🔌",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?autoformat&fit=crop&w=600&q=80",
    },
    {
      displayName: "Mechanical",
      value: "Mechanical Engineering",
      desc: "CAD/CAM, Automobiles & Design",
      icon: "⚙️",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    },
    {
      displayName: "Civil",
      value: "Civil Engineering",
      desc: "Architecture, Structures & Urban Planning",
      icon: "🏗️",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
    },
    {
      displayName: "Management",
      value: "Management Studies",
      desc: "Business Pitching, Finance & Leadership",
      icon: "📊",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    },
    {
      displayName: "Cultural & Arts",
      value: "Cultural & Arts",
      desc: "Music, Dance, Drama & Creative Arts",
      icon: "🎭",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    },
  ], []);

  // Fetch events from API
  const fetchEvents = async () => {
  setLoading(true);
  try {
    const res = await API.get("/events");
    setAllEvents(res.data);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNavigate = useCallback((event) => {
    if (event) {
      navigate("/register-event", { state: { event } });
    }
  }, [navigate]);

  const handleShare = useCallback((event) => {
    if (!event) return;
    if (navigator.share) {
      navigator.share({
        title: event.title || "Event",
        text: event.description || "Check out this event!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Event link copied to clipboard!", "success");
    }
  }, [showToast]);

  // Ensure allEventsArray is safely an array
  const allEventsArray = useMemo(() => Array.isArray(allEvents) ? allEvents : [], [allEvents]);

  // Computed / Filtered Data
  const isFiltering = Boolean((searchQuery && searchQuery.trim()) || selectedDepartment);

  const filteredEvents = useMemo(() => {
    return allEventsArray.filter((event) => {
      if (!event) return false;
      const q = (searchQuery || "").trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        (event.title?.toLowerCase() || "").includes(q) ||
        (event.description?.toLowerCase() || "").includes(q) ||
        (event.department?.toLowerCase() || "").includes(q) ||
        (event.location?.toLowerCase() || "").includes(q);
      if (!matchesSearch) return false;
      if (!selectedDepartment) return true;
      const eventDept = (event.department || "").trim().toLowerCase();
      const selDept = (selectedDepartment || "").trim().toLowerCase();
      return eventDept === selDept;
    });
  }, [allEventsArray, searchQuery, selectedDepartment]);

// Dashboard Statistics
const totalEvents = allEventsArray.length;

const totalDepartments = [
  ...new Set(allEventsArray.map(event => event.department).filter(Boolean))
].length;

const upcomingEvents = allEventsArray.filter(
  event => event.date && new Date(event.date) > new Date()
);

const upcomingEventsCount = upcomingEvents.length;

const openRegistrations = allEventsArray.filter(
  event => (event.capacity ?? 0) > 0
).length;

// Featured Events
const featuredEvents = allEventsArray.slice(0, 3);

// Trending Events
const trendingEvents = [...allEventsArray]
  .sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0))
  .slice(0, 4);
   return (
    <div className="page">
      <Navbar />

      {/* Premium Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}


      <div className="page-shell">
        {/* Continuous Floating Backgrounds */}
        <div className="page-bg-elements">
          <div className="bg-blob bg-blob-1"></div>
          <div className="bg-blob bg-blob-2"></div>
          <div className="bg-blob bg-blob-3"></div>
          <div className="bg-blob bg-blob-4"></div>
        </div>

        {/* Premium Hero Section */}
        <header className="page-header premium-hero">
          <div className="hero-content">
            <span className="hero-eyebrow">The Ultimate Event Management Platform</span>
            <h1 className="hero-title">
              Discover <span className="gradient-text animated-gradient">Amazing College Events</span>
            </h1>
            <p className="hero-subtitle">
              Search by title, department, or location to explore and register for the best technical and cultural events on campus. Experience seamless registration.
            </p>
            <div className="search-bar-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search events by name, location or department..."
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {!isFiltering && (
              <div className="hero-action-buttons">
                <button className="btn-hero-primary" onClick={() => document.getElementById('departments')?.scrollIntoView({behavior: 'smooth'})}>
                  Explore Events
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Sections */}
        {!isFiltering && (
          <>
            {/* Statistics Section */}
            <div className="statistics-section reveal active">
              <h3 className="section-title">Platform Overview</h3>
              <div className="stats-grid">
                <div className="stat-card-premium">
                  <div className="stat-icon-wrapper blue pulse">📊</div>
                  <div className="stat-info">
                    <span className="stat-value">{totalEvents || 0}</span>
                    <span className="stat-label">Total Events</span>
                  </div>
                </div>
                <div className="stat-card-premium">
                  <div className="stat-icon-wrapper purple pulse delay-1">🏢</div>
                  <div className="stat-info">
                    <span className="stat-value">{totalDepartments || 0}</span>
                    <span className="stat-label">Departments</span>
                  </div>
                </div>
                <div className="stat-card-premium">
                  <div className="stat-icon-wrapper orange pulse delay-2">🚀</div>
                  <div className="stat-info">
                    <span className="stat-value"><AnimatedCounter end={upcomingEventsCount || 0} /></span>
                    <span className="stat-label">Upcoming Events</span>
                  </div>
                </div>
                <div className="stat-card-premium">
                  <div className="stat-icon-wrapper green pulse delay-3">🎟️</div>
                  <div className="stat-info">
                    <span className="stat-value"><AnimatedCounter end={openRegistrations || 0} /></span>
                    <span className="stat-label">Open Registrations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Events */}
            {Array.isArray(featuredEvents) && featuredEvents.length > 0 && (
              <div className="featured-events-section reveal active">
                <div className="section-header-inline">
                  <h2 className="section-title-large">⭐ Featured Events</h2>
                  <p className="section-subtitle">Handpicked experiences just for you</p>
                </div>
                <div className="featured-events-scroll">
                  {featuredEvents.map(event => (
                    <div className="featured-event-card" key={`featured-${event?._id || Math.random()}`}>
                      <div className="featured-image">
                        <img src={event?.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"} alt={event?.title || "Event"} />
                        <div className="featured-overlay"></div>
                        <span className="featured-tag">Featured</span>
                      </div>
                      <div className="featured-content">
                        {event?.department && <span className="featured-dept">{event.department}</span>}
                        <h3 className="featured-title">{event?.title || "Untitled"}</h3>
                        <p className="featured-desc">{(event?.description || "No description available.").substring(0, 80)}...</p>
                        <div className="featured-meta">
                          <span>📅 {event?.date ? new Date(event.date).toLocaleDateString() : "TBA"}</span>
                          <span>📍 {event?.location || "TBA"}</span>
                        </div>
                        <button className="btn-featured ripple" onClick={() => navigate("/register-event", { state: { event } })}>
                          Explore Event &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Events */}
            {Array.isArray(trendingEvents) && trendingEvents.length > 0 && (
              <div className="trending-events-section reveal active">
                <div className="section-header-inline">
                  <h2 className="section-title-large">🔥 Trending Now</h2>
                  <p className="section-subtitle">Most popular events filling up fast</p>
                </div>
                <div className="trending-events-scroll">
                  {trendingEvents.map(event => (
                    <div className="trending-event-card" key={`trending-${event?._id || Math.random()}`} onClick={() => navigate("/register-event", { state: { event } })}>
                      <div className="trending-image">
                        <img src={event?.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"} alt={event?.title || "Event"} />
                        <div className="trending-overlay"></div>
                      </div>
                      <div className="trending-content">
                        <div className="trending-badges">
                          {event?.department && <span className="t-badge">{event.department}</span>}
                          <span className="t-badge hot">Trending</span>
                        </div>
                        <h3 className="trending-title">{event?.title || "Untitled"}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events Grid */}
            {Array.isArray(upcomingEvents) && upcomingEvents.length > 0 && (
              <div className="upcoming-events-section reveal active">
                <h2 className="section-title-large">🚀 Upcoming Events</h2>
                <p className="section-subtitle">Don't miss out on these soon-to-happen events</p>
                <div className="events-grid">
                  {upcomingEvents.map(event => (
                    <EventCard 
                      key={event?._id || Math.random()} 
                      event={event} 
                      registeringId={registeringId} 
                      onShare={handleShare} 
                      onNavigate={handleNavigate} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Department Showcase */}
            <div id="departments" className="department-section reveal active">
              <div className="department-section-header reveal active">
                <h2>Browse by Department</h2>
                <p>Find the most exciting opportunities tailored to your field of study</p>
              </div>
              <div className="department-showcase-grid">
                {Array.isArray(departments) && departments.map((dept) => {
                  const deptEventsCount = allEventsArray.filter(e => e?.department?.trim().toLowerCase() === dept.value.trim().toLowerCase()).length;
                  return (
                    <div
                      key={dept.value}
                      className="dept-showcase-card tilt-effect"
                      onClick={() => {
                        setSelectedDepartment(dept.value);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                    >
                      <img src={dept.image} alt={dept.displayName} className="dept-bg-image" />
                      <div className="dept-bg-overlay"></div>
                      <div className="dept-content-inner">
                        <div className="dept-icon-floating">{dept.icon}</div>
                        <div>
                          <h3 className="dept-name-large">{dept.displayName}</h3>
                          <p className="dept-short-desc">{dept.desc}</p>
                        </div>
                        <div className="dept-bottom-row">
                          <span className="dept-event-count">{deptEventsCount} Events</span>
                          <span className="dept-arrow">&rarr;</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Search Results / Filtered Events */}
        {isFiltering && (
          <div className="reveal active" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '1250px', margin: '0 auto', padding: '0 30px', marginBottom: '24px' }}>
              <button className="btn-secondary ripple" onClick={() => { setSelectedDepartment(""); setSearchQuery(""); }}>
                ← Back to Overview
              </button>
            </div>
            <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: '28px', color: 'var(--ink)' }}>
              {searchQuery ? `Search Results for "${searchQuery}"` : `${departments.find(d => d.value === selectedDepartment)?.displayName || selectedDepartment} Events`}
            </h2>

            {loading ? (
              <div className="events-grid">
                {[1, 2, 3].map(i => (
                  <div className="skeleton-card shimmer" key={i}></div>
                ))}
              </div>
            ) : (
              <div className="events-grid">
                {Array.isArray(filteredEvents) && filteredEvents.length === 0 ? (
                  <div className="no-events-container premium-empty-state" style={{ gridColumn: "1 / -1" }}>
                    <div className="empty-icon-animated">🧐</div>
                    <h3>No Events Found</h3>
                    <p>Try adjusting your search or filter to find what you're looking for.</p>
                    <button className="btn-hero-primary ripple" onClick={() => { setSelectedDepartment(""); setSearchQuery(""); }} style={{marginTop: '20px'}}>
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  Array.isArray(filteredEvents) && filteredEvents.map(event => (
                    <EventCard 
                      key={event?._id || Math.random()} 
                      event={event} 
                      registeringId={registeringId} 
                      onShare={handleShare} 
                      onNavigate={handleNavigate} 
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Smooth Back to Top Button */}
        <button
          className={`back-to-top bounce ${showScrollTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        {/* Premium Glassmorphism Footer */}
        <footer className="footer-premium glass-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="footer-logo pulse-logo">✨ EventHub</span>
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
                <li><a href="#departments">Departments</a></li>
              </ul>
            </div>
            <div className="footer-newsletter">
              <h4>Stay Updated</h4>
              <p>Get the latest event updates right here.</p>
              
          
            </div>
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p>📧 ashababu.dev@gmail.com</p>
              <p>📞 +91-6380535754</p>
              <div className="footer-social">
                <a href="#" className="social-icon hover-lift">🐦</a>
                <a href="#" className="social-icon hover-lift">📸</a>
                <a href="#" className="social-icon hover-lift">💼</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EventHub Registration System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Events;