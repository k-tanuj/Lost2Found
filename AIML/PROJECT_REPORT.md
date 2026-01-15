# 📘 Lost2Found AI Service - Project Report

## 1. Executive Summary
This document details the development of the **AI Microservice** for the Lost2Found platform. The service is responsible for analyzing images of lost items and intelligently matching them with found items using keywords and visual descriptions.

We successfully built a **Zero-Cost, Google-Powered** solution using the latest Generative AI technology.

---

## 2. Technical Architecture
The AI Service is built as a standalone microservice to ensure scalability and separation of concerns.

- **Language**: Python 3.x
- **Framework**: FastAPI (chosen for speed and native async support)
- **AI Model**: **Google Gemini 1.5 Flash** (via Google AI Studio)
- **Algorithm**: Jaccard Similarity Index for tag matching
- **Deployment**: Configured for Render (Free Tier) with `Procfile`

---

## 3. Key Challenges & The "Pivot"
Our journey involved a significant technical pivot to adhere to the "Free Tier Only" constraint of the hackathon.

### Challenge: Google Cloud Billing
Initially, we planned to use the **Google Cloud Vision API**. However, enabling this API requires a credit card for identity verification, even for the free tier. This was a blocker for the team.

### Solution: Switching to Gemini
We researched alternatives and discovered **Google AI Studio**, which offers access to Gemini models (Google's newest Multimodal AI) without requiring a credit card for the free tier.
- **Benefit 1**: Solved the billing blocker immediately.
- **Benefit 2**: Gemini is "context-aware" (Generative) vs Vision API (Discriminative), allowing for richer descriptions of lost items (e.g., "A worn-out blue leather wallet" vs just "Wallet").

---

## 4. API Endpoints

### `POST /analyze-image`
- **Input**: Raw image file.
- **Process**:
    1.  Receives image.
    2.  Constructs a prompt: *"Analyze this image... return keywords and colors."*
    3.  Sends both Image + Prompt to Gemini 1.5 Flash.
    4.  Parses the JSON response.
- **Output**:
    ```json
    {
      "labels": ["Backpack", "School Bag", "Black"],
      "colors": ["Black", "Grey"]
    }
    ```

### `POST /match-items`
- **Input**: Target item tags + List of Candidate items.
- **Process**: Calculates the **Jaccard Similarity** coefficient between the target's tags and each candidate's tags.
    - `Score = (Intersection of Tags) / (Union of Tags)`
- **Output**: List of matches sorted by relevance score.

---

## 5. Deployment & Security
- **Environment Handling**: API Keys are stored in `.env` (locally) and Environment Variables (on Cloud), never hardcoded.
- **Git Security**: `.gitignore` ensures secrets are never pushed to GitHub.
- **Procfile**: Added to enable seamless deployment on Render/Railway.

---

## 6. How to Run Locally
1.  **Install**: `pip install -r requirements.txt`
2.  **Setup**: Add `GEMINI_API_KEY` to `.env`.
3.  **Run**: `uvicorn main:app --reload`
