
# 🚀 Lost2Found

> A campus-centric Lost & Found web application built with the MERN stack and Firebase, designed to help students easily report, find, and return lost items on campus.

🔗 **Live Demo:** https://k-tanuj-lost2found.hf.space/

---

## 🧠 Overview

**Lost2Found** is a modern web platform tailored for university campuses. It enables students to report lost or found items, receive real-time notifications, and track the full lifecycle of items — from reporting to successful return.

The system emphasizes clarity, trust, and speed, ensuring that no item or request goes unnoticed.

---

## ✨ Key Features

- 📝 Report lost or found items with images  
- 🤖 AI-assisted matching (text + image similarity)  
- 🔔 Real-time in-app notifications (no email dependency)  
- 🧭 Item lifecycle tracking (Reported → Claimed → Returned)  
- 📸 Image handling via Cloudinary  
- 🔐 Secure authentication using Firebase Auth  

---

## 🧱 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React (Vite), Tailwind CSS |
| Backend | Node.js, Express |
| Database | Firebase Firestore (Real-time) |
| Authentication | Firebase Authentication |
| Media Storage | Cloudinary |
| AI Matching | Python Service (Gemini API) |

---

## 🖥 Live Demo

Try the deployed application here:

👉 https://k-tanuj-lost2found.hf.space/

Best viewed on modern desktop or mobile browsers.

---

## 📂 Project Structure

```
Lost2Found/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── vite.config.js
├── .env.example
├── README.md
└── package.json
```

---

## ⚙️ Local Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/k-tanuj/Lost2Found.git
cd Lost2Found
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`:

```
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open the app at: `http://localhost:3000`

---

## 🔄 Application Flow

1. User logs in using Firebase Authentication  
2. User reports a lost or found item  
3. AI service checks for potential matches  
4. Item owner receives a real-time notification  
5. Claim is reviewed and verified  
6. Item is marked as returned or secured  

---

## 🔔 Notification System

- Fully in-app (no email dependency)
- Real-time updates using Firestore listeners
- Action-required notifications cannot be ignored
- Notification state reflects item lifecycle

---

## 🧠 AI Matching

The AI service compares:
- Item descriptions
- Uploaded images
- Contextual metadata

It returns potential matches with confidence scores to assist users in verifying claims.

---

## 🚧 Future Enhancements

- Browser push notifications (PWA)
- Campus map with lost-item heatmaps
- Secure in-app chat between users
- QR codes for secured items
- Admin moderation dashboard

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository  
2. Create a new feature branch  
3. Commit your changes  
4. Open a Pull Request  

---

## 👤 Author

**Tanuj Kumawat**  
📧 tanujkumawat3008@gmail.com  

---

## 📜 License

This project is licensed under the **MIT License**.
