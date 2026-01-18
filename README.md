# 🕵️‍♂️ Lost2Found
> **Reuniting belongings with their owners through the power of AI.**

**Lost2Found** is a next-generation campus lost and found platform. It replaces outdated spreadsheets and physical notice boards with an intelligent, centralized system that uses **Computer Vision (Gemini AI)** to automatically match lost items with found reports.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Status](https://img.shields.io/badge/status-active-success.svg)

---

## ✨ Key Features

### 🧠 Smart AI Matching
- **Instant Analysis:** Upload a photo, and our AI (Google Gemini) instantly detects the item's **category**, **color**, and **visual tags**.
- **Auto-Matching:** The system automatically cross-references new reports with the existing database. If a match >80% is found, users are alerted immediately.

### 🔐 Secure Chain of Custody
- **Digital Passport:** Every item gets a unique **QR Code**.
- **Handover Verification:** Scanning the QR code leads to an official verification page (`/item/:id`), proving ownership and preventing fraud during physical handovers.
- **Status Tracking:** Items move through strictly defined states: `Active` → `Pending Claim` → `Returned` / `Secured`.

### 🛡️ Secure Claims Workflow
1.  **Claim:** Users must submit proof (description or hidden details) to claim an item.
2.  **Review:** The original reporter (Owner) receives an email & notification to review the proof.
3.  **Approve:** Only the Owner can approve the claim to reveal contact details or meeting spots.

### 📱 Modern Experience
- **Interactive Dashboard:** View real-time stats and recent activity.
- **Global Search:** Filter items by category, status, or keyword.
- **User Guide:** Built-in interactive tutorial for new users.

---

## 🛠️ Technology Stack

| Component | Tech |
| :--- | :--- |
| **Frontend** | React (Vite), TailwindCSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Firestore (Real-time NoSQL) |
| **Auth** | Firebase Authentication (Google Sign-In) |
| **AI Engine** | Python (FastAPI), Google Gemini 1.5 Flash |
| **Storage** | Cloudinary (Images), Firebase Storage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Firebase Account
- Cloudinary Account
- Gemini API Key

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/Lost2Found.git
    cd Lost2Found
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    # Create .env file with VITE_FIREBASE_*, VITE_API_URL
    npm run dev
    ```

3.  **Backend Setup**
    ```bash
    cd ../Backend
    npm install
    # Create .env file with GEMINI_API_KEY, CLOUDINARY_*, FRONTEND_URL
    node server.js
    ```

4.  **AI Service Setup**
    ```bash
    cd ../AIML
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    python main.py
    ```

---

## 📂 Project Structure

```
Lost2Found/
├── 📂 frontend/          # React Application (UI/UX)
│   ├── 📂 src/
│   │   ├── 📂 pages/     # Dashboard, Activity, Matches, Guide
│   │   ├── 📂 components/# Navbar, ItemCard, NotificationBell
│   │   └── 📂 services/  # API connectors
├── 📂 Backend/           # Express API Server
│   ├── 📂 controllers/   # Logic for Items, Notifications
│   ├── 📂 routes/        # API Endpoints
│   └── 📂 utils/         # Cloudinary & Email helpers
└── 📂 AIML/              # Python AI Microservice
    └── main.py           # FastAPI app for Gemini integration
```

---

## 👥 Authors

Built by **Team Lost2Found** for the **ISEC Data Challenge**.
