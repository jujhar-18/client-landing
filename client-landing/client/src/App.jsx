import { useState, useEffect } from "react";
import "./App.css";

// 🌐 Backend URL — change this if your server runs on a different port
const API_URL = "http://localhost:5000";

// ─── Service Options ────────────────────────────────────────────
const SERVICES = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "SEO & Marketing",
  "Consulting",
  "Other",
];

// ─── Main App Component ─────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home"); // 'home' or 'admin'
  return (
    <div className="app">
      <Nav page={page} setPage={setPage} />
      {page === "home" ? <LandingPage /> : <AdminPage />}
    </div>
  );
}

// ─── Navigation ─────────────────────────────────────────────────
function Nav({ page, setPage }) {
  return (
    <nav className="nav">
      <div className="nav-brand">✦ ClientFlow</div>
      <div className="nav-links">
        <button
          className={page === "home" ? "nav-btn active" : "nav-btn"}
          onClick={() => setPage("home")}
        >
          Home
        </button>
        <button
          className={page === "admin" ? "nav-btn active" : "nav-btn"}
          onClick={() => setPage("admin")}
        >
          Admin Panel
        </button>
      </div>
    </nav>
  );
}

// ─── Landing Page ────────────────────────────────────────────────
function LandingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  // Update form field
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Submit form to backend
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", service: "", message: "" });
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("Could not connect to server. Is it running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape s1" />
          <div className="shape s2" />
          <div className="shape s3" />
        </div>
        <div className="hero-content">
          <span className="hero-tag">★ We're open for new clients</span>
          <h1 className="hero-title">
            Build Something
            <br />
            <span className="accent">Extraordinary</span>
          </h1>
          <p className="hero-sub">
            We craft digital experiences that convert visitors into customers.
            Tell us about your project — we'll make it happen.
          </p>
          <a href="#contact" className="cta-btn">
            Get in Touch ↓
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        {[
          { icon: "⚡", title: "Fast Delivery", desc: "Projects shipped in weeks, not months." },
          { icon: "🎨", title: "Custom Design", desc: "Tailored to your brand and audience." },
          { icon: "📈", title: "Results Driven", desc: "We focus on metrics that matter." },
        ].map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="contact-text">
            <h2>Start Your Project</h2>
            <p>Fill out the form and we'll get back to you within 24 hours.</p>
            <ul className="perks">
              <li>✓ Free initial consultation</li>
              <li>✓ No commitment required</li>
              <li>✓ Custom project quote</li>
            </ul>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Service Needed</label>
                <select name="service" value={form.service} onChange={handleChange}>
                  <option value="">Select a service...</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group full">
              <label>Your Message</label>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us about your project..."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message →"}
            </button>

            {/* Feedback messages */}
            {status === "success" && (
              <div className="alert success">
                🎉 Thanks! We'll be in touch soon.
              </div>
            )}
            {status && status !== "success" && (
              <div className="alert error">⚠ {status}</div>
            )}
          </form>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 ClientFlow — Built with React + Express.js</p>
      </footer>
    </>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────
function AdminPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Fetch all clients from backend
  async function fetchClients() {
    try {
      const res = await fetch(`${API_URL}/clients`);
      const data = await res.json();
      setClients(data.reverse()); // show newest first
    } catch {
      alert("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  // Delete a client
  async function deleteClient(id) {
    if (!window.confirm("Remove this client?")) return;
    await fetch(`${API_URL}/clients/${id}`, { method: "DELETE" });
    setClients(clients.filter((c) => c.id !== id));
  }

  // Filter + search
  const visible = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.service === filter;
    return matchSearch && matchFilter;
  });

  return (
    <section className="admin">
      <div className="admin-header">
        <h2>Client Database</h2>
        <span className="client-count">{clients.length} total clients</span>
      </div>

      {/* Search & Filter */}
      <div className="admin-controls">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Services</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button className="refresh-btn" onClick={fetchClients}>↻ Refresh</button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="loading-text">Loading clients...</p>
      ) : visible.length === 0 ? (
        <p className="empty-text">No clients found. Submit the form first!</p>
      ) : (
        <div className="table-wrap">
          <table className="client-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td><span className="badge">{c.service}</span></td>
                  <td className="msg-cell">{c.message || "—"}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="del-btn" onClick={() => deleteClient(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
