# 🧠 Lost2Found - AI Service

The intelligent brain of the Lost2Found platform, powered by **Google Gemini**.

## 🚀 Features
- **Visual Analysis**: Uses **Gemini 1.5 Flash** to "see" images and describe them.
- **Smart Matching**: Uses Jaccard Similarity to match lost items with found ones.
- **Zero Cost**: Built entirely on Google's Free Tier.

## 🛠️ Setup Guide

### 1. Prerequisites
- Python 3.10+
- A Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### 2. Installation
```bash
cd AIML
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configuration
Create a file named `.env` in this folder and add your key:
```ini
GEMINI_API_KEY=AIzaSyDxxxxxxxxx...
```

### 4. Running the Server
```bash
uvicorn main:app --reload
```
Server will start at `http://127.0.0.1:8000`.

## 🧪 Testing
We have included a test script that simulates the Frontend sending data:
```bash
python test_client.py
```

## 📖 Documentation
See [PROJECT_REPORT.md](./PROJECT_REPORT.md) for a detailed explanation of the architecture, challenges, and solutions.
