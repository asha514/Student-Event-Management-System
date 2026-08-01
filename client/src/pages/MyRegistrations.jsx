import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./events.css";
import "./myRegistrations.css";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Date (Nearest)");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await API.get("/registrations/my");
      setRegistrations(response.data);
    } catch (error) {
      console.log("Error fetching registrations:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    if (window.confirm("Are you sure you want to cancel this registration?")) {
      try {
        await API.delete(`/registrations/${registrationId}`);
        alert("Registration cancelled successfully.");
        fetchRegistrations();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to cancel registration. Endpoint might not be implemented.");
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("All");
    setStatusFilter("All");
    setSortBy("Date (Nearest)");
  };

  // Derived Values
  const today = new Date();
  const totalRegistrations = registrations.length;
  const upcomingEvents = registrations.filter(r => {
    const d = new Date((r.eventId || r.event)?.date);
    return d >= today;
  }).length;
  const completedEvents = registrations.filter(r => {
    const d = new Date((r.eventId || r.event)?.date);
    return d < today;
  }).length;
  // Fallback for active if we have no cancellation field
  const activeRegistrations = upcomingEvents; 

  // Unique Departments for filter
  const departments = ["All", ...new Set(registrations.map(r => (r.eventId || r.event)?.department).filter(Boolean))];

  // Filtering Logic
  let filteredRegistrations = registrations.filter(item => {
    const event = item.eventId || item.event;
    if (!event) return false;

    // Search
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (event.title || "").toLowerCase().includes(q) || (event.location || "").toLowerCase().includes(q);

    // Department
    const matchesDept = departmentFilter === "All" || event.department === departmentFilter;

    // Status
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= today;
    let matchesStatus = true;
    if (statusFilter === "Upcoming") matchesStatus = isUpcoming;
    if (statusFilter === "Completed") matchesStatus = !isUpcoming;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Sorting Logic
  filteredRegistrations = filteredRegistrations.sort((a, b) => {
    const dateA = new Date((a.eventId || a.event).date);
    const dateB = new Date((b.eventId || b.event).date);

    if (sortBy === "Date (Nearest)") return dateA - dateB;
    if (sortBy === "Date (Furthest)") return dateB - dateA;
    if (sortBy === "Recently Registered") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div className="page">
      <Navbar />

      <div className="page-shell">
        {/* Premium Hero Section */}
        <header className="page-header premium-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              My <span className="gradient-text">Registrations</span>
            </h1>
            <p className="hero-subtitle">
              View, manage, and track all your registered events in one secure place.
            </p>
          </div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </header>

        {loading ? (
          <div className="events-grid" style={{ padding: '40px 30px' }}>
            {[1, 2, 3].map((i) => (
              <div className="skeleton-card" key={i} />
            ))}
          </div>
        ) : registrations.length === 0 ? (
          <div className="dashboard-container" style={{ padding: '0 30px', margin: '40px auto' }}>
            <div className="empty-state-premium">
              <div className="empty-icon">🎟️</div>
              <h3>No Registrations Yet</h3>
              <p>You haven't registered for any events yet. Your secure digital tickets will show up here once you do.</p>
              <Link to="/events" className="btn-auth-premium" style={{ width: 'auto', marginTop: '16px', textDecoration: 'none', display: 'inline-block' }}>
                Browse Events &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="dashboard-container">
              <div className="statistics-section" style={{ marginTop: '0' }}>
                <h3 className="section-title">Dashboard</h3>
                <div className="stats-grid">
                  <div className="stat-card-premium">
                    <div className="stat-icon-wrapper blue">📋</div>
                    <div className="stat-info">
                      <span className="stat-value">{totalRegistrations}</span>
                      <span className="stat-label">Total Registrations</span>
                    </div>
                  </div>
                  <div className="stat-card-premium">
                    <div className="stat-icon-wrapper green">🚀</div>
                    <div className="stat-info">
                      <span className="stat-value">{upcomingEvents}</span>
                      <span className="stat-label">Upcoming Events</span>
                    </div>
                  </div>
                  <div className="stat-card-premium">
                    <div className="stat-icon-wrapper purple">✅</div>
                    <div className="stat-info">
                      <span className="stat-value">{completedEvents}</span>
                      <span className="stat-label">Completed Events</span>
                    </div>
                  </div>
                  <div className="stat-card-premium">
                    <div className="stat-icon-wrapper orange">🎟️</div>
                    <div className="stat-info">
                      <span className="stat-value">{activeRegistrations}</span>
                      <span className="stat-label">Active Registrations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="dashboard-container filter-controls-premium">
              <div className="controls-grid">
                <div className="control-group search-group">
                  <span className="control-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search your events..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="premium-input"
                  />
                </div>
                
                <div className="control-group">
                  <select 
                    value={departmentFilter} 
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="premium-select"
                  >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="control-group">
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="premium-select"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="control-group">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="premium-select"
                  >
                    <option value="Date (Nearest)">Sort: Date (Nearest)</option>
                    <option value="Date (Furthest)">Sort: Date (Furthest)</option>
                    <option value="Recently Registered">Sort: Recently Registered</option>
                  </select>
                </div>

                {(searchQuery || departmentFilter !== "All" || statusFilter !== "All" || sortBy !== "Date (Nearest)") && (
                  <button className="btn-clear-filters" onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Registered Events Grid */}
            <div className="events-grid" style={{ padding: '0 30px 80px', maxWidth: '1250px', margin: '0 auto' }}>
              {filteredRegistrations.length === 0 ? (
                <div className="empty-state-premium" style={{ gridColumn: '1 / -1' }}>
                  <div className="empty-icon">🧐</div>
                  <h3>No matching registrations</h3>
                  <p>Try adjusting your search or filters to find what you're looking for.</p>
                  <button className="btn-secondary" onClick={clearFilters} style={{ marginTop: '16px' }}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredRegistrations.map((item) => {
                  const event = item.eventId || item.event;
                  const defaultImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80";
                  
                  const eventDate = new Date(event?.date);
                  const isUpcoming = eventDate >= today;
                  const regDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently";

                  return (
                    <div className="event-card-premium" key={item._id}>
                      <div className="event-card-image">
                        <img src={event?.image || defaultImage} alt={event?.title} />
                        <div className="event-badges-top">
                          <span className="badge-dept">{event?.department || "General"}</span>
                          <span className={`badge-status ${isUpcoming ? "open" : "closed"}`}>
                            {isUpcoming ? "🟢 Upcoming" : "⚪ Completed"}
                          </span>
                        </div>
                      </div>

                      <div className="event-card-body">
                        <h3 className="event-title">{event?.title || "Event Name"}</h3>
                        <p className="event-desc">{(event?.description || "No description available.").substring(0, 80)}...</p>
                        
                        <div className="event-meta-grid" style={{ marginTop: '16px' }}>
                          <div className="meta-item">
                            <span className="meta-icon">📅</span>
                            <span className="meta-text">
                              {event?.date ? eventDate.toLocaleDateString(undefined, {
                                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                              }) : "No date"}
                            </span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-icon">📍</span>
                            <span className="meta-text">{event?.location || "No location"}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-icon">🕒</span>
                            <span className="meta-text">Registered: {regDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="event-card-footer" style={{ flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                        <Link to="/registration-success" state={{ registration: item, event: event }} style={{ textDecoration: 'none', flex: 1, minWidth: '120px' }}>
                          <button className="btn-secondary" style={{ width: '100%', whiteSpace: 'nowrap' }}>View Details</button>
                        </Link>
                        
                        {isUpcoming && (
                          <button 
                            className="btn-secondary" 
                            style={{ flex: 1, minWidth: '120px', color: 'var(--red)', borderColor: 'var(--red-light)' }}
                            onClick={() => handleCancelRegistration(item._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
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

export default MyRegistrations;
