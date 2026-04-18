// 📦 Import required packages
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// 🚀 Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Path to our "database" file (using /tmp for serverless environments like Lambda)
const DB_FILE = path.join("/tmp", "clients.json");

// ─── Middleware ────────────────────────────────────────────────
// Allow React frontend to talk to this server
app.use(cors({ origin: '*' }));
// Parse incoming JSON request bodies
app.use(express.json());

// ─── Helper: Read clients from file ───────────────────────────
function readClients() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}

// ─── Helper: Save clients to file ─────────────────────────────
function saveClients(clients) {
  fs.writeFileSync(DB_FILE, JSON.stringify(clients, null, 2));
}

// ─── Routes ───────────────────────────────────────────────────

// GET /clients — fetch all clients
app.get("/clients", (req, res) => {
  const clients = readClients();
  res.json(clients);
});

// POST /clients — add a new client
app.post("/clients", (req, res) => {
  const { name, email, phone, service, message } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const clients = readClients();

  // Create a new client object
  const newClient = {
    id: Date.now(), // simple unique ID using timestamp
    name,
    email,
    phone: phone || "N/A",
    service: service || "Not specified",
    message: message || "",
    createdAt: new Date().toISOString(),
  };

  clients.push(newClient);
  saveClients(clients);

  res.status(201).json({ success: true, client: newClient });
});

// DELETE /clients/:id — delete a client by ID
app.delete("/clients/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let clients = readClients();
  const before = clients.length;
  clients = clients.filter((c) => c.id !== id);

  if (clients.length === before) {
    return res.status(404).json({ error: "Client not found." });
  }

  saveClients(clients);
  res.json({ success: true });
});

// ─── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
