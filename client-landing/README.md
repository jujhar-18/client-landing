# ClientFlow — React + Express Landing Page

A beginner-friendly full-stack app with a landing page and admin panel for storing client info.

---

## 📁 Project Structure

```
client-landing/
├── server/          ← Express.js backend
│   ├── index.js     ← Main server file
│   ├── clients.json ← Auto-created "database" (JSON file)
│   └── package.json
│
└── client/          ← React frontend (Vite)
    ├── src/
    │   ├── App.jsx  ← All React components
    │   ├── App.css  ← Styles
    │   └── main.jsx ← Entry point
    ├── index.html
    └── package.json
```

---

## 🚀 How to Run

### Step 1 — Start the Backend (Express)

```bash
cd server
npm install
npm start
```

Server runs at: **http://localhost:5000**

### Step 2 — Start the Frontend (React)

Open a **new terminal window**, then:

```bash
cd client
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🌟 Features

### Landing Page (Home)
- **Hero section** with animated background shapes
- **Features section** highlighting your services
- **Contact form** with fields for:
  - Name, Email, Phone
  - Service selection (dropdown)
  - Message textarea
- Success/error feedback on form submission

### Admin Panel
- View all submitted clients in a table
- **Search** by name or email
- **Filter** by service type
- **Delete** individual clients
- Refresh button to reload data

---

## 🔌 API Endpoints

| Method | Route           | Description          |
|--------|-----------------|----------------------|
| GET    | /clients        | Get all clients      |
| POST   | /clients        | Add a new client     |
| DELETE | /clients/:id    | Delete a client      |

---

## 💡 How Data is Stored

For simplicity (beginner-friendly!), this app stores data in a `clients.json` file on the server. In a real app, you'd replace this with a database like **MongoDB** or **PostgreSQL**.

---

## 🔧 Technologies Used

- **React 18** + **Vite** (frontend)
- **Express.js** (backend/API)
- **CORS** (allow frontend ↔ backend communication)
- **fs** module (file-based storage — no database needed!)
- **CSS Variables** + **Google Fonts** (styling)
