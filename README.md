---
title: Lost2Found
emoji: 🎒
colorFrom: indigo
colorTo: blue
sdk: docker
pinned: false
app_port: 7860
---

# Lost2Found 🔍

**Reuniting people with their belongings through AI.**

Lost2Found is a next-generation lost and found platform that uses **Advanced AI Matching** to instantly connect lost items with found reports. We replace chaotic message boards with a streamlined, secure, and empathetic recovery process.

## ✨ Key Features

### 🤖 Smart AI Matching
Instead of manually searching through hundreds of posts, our AI analyzes item descriptions, locations, and images to find matches automatically.
- **Visual Recognition:** Matches items based on photos.
- **Context Awareness:** Understands fuzzy descriptions (e.g., "blue tote" matches "navy bag").

### 🤝 Mutual Resolution
We foster honest community interactions.
- **Secure Claims:** Owners must prove ownership before contact details are shared.
- **Sync Status:** When an item is returned, both the "Lost" and "Found" reports are automatically closed for everyone.

### 🔒 Privacy First
- Contact information is hidden until a match is verified.
- Safe interactions are prioritized at every step.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Firebase Project

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/k-tanuj/Lost2Found.git
    ```

2.  **Install Dependencies**
    ```bash
    # Frontend
    cd frontend
    npm install

    # Backend
    cd ../Backend
    npm install

    # AI Service
    cd ../AIML
    pip install -r requirements.txt
    ```

3.  **Run the Project**
    ```bash
    # Start Backend
    cd Backend
    npm start

    # Start Frontend
    cd frontend
    npm run dev

    # Start AI Service
    cd AIML
    uvicorn main:app --reload
    ```

## 🛠️ Built With
- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, Firebase Firestore
- **AI Core:** Python, Sentence Transformers

---

*Lost2Found - making lost items a thing of the past.*
