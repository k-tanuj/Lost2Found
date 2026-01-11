# 🧠 AI/ML Workflow Guide for Lost2Found

Hello AI Lead! 👋
This guide covers everything you need to build the "Brain" of Lost2Found using free tools.

---

## 1. The AI Flow (Simple English)
Imagine a user finds a **Black Backpack** and takes a photo.
1.  **Frontend** sends the photo to the **AI**.
2.  **AI** asks Google Vision: "What's in this picture?"
3.  **Google Vision** replies: `"Backpack", "Bag", "Black", "Zipper"`.
4.  **AI** saves these "keywords" (labels).
5.  Later, someone searches for a "Lost Black Bag".
6.  **AI** compares the search words with the saved labels using **Text Similarity**.
7.  **AI** returns the best matches.

---

## 2. Google Vision API (The Eyes)
We don't need to train a model! Google has already trained a massive model to recognize millions of objects. We just use their API.
- **Input**: Image file (or Base64 string).
- **Output**: List of labels (e.g., `["Shoe", "Sneakers", "Nike"]`).
- **Cost**: Free for the first 1,000 calls per month (plenty for a hackathon).

### ✅ Action Item: Get API Key
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a New Project (e.g., "lost2found-hackathon").
3.  Enable **"Cloud Vision API"**.
4.  Go to **IAM & Admin** > **Service Accounts**.
5.  Create a service account -> Generate Key -> **JSON**.
6.  Download the file and save it as `service_account.json` in this `AIML` folder.
    > ⚠️ **IMPORTANT**: NEVER commit this file to GitHub! Run `echo service_account.json >> .gitignore`.

---

## 3. Matching Logic (The Brain)
We need a way to say if "Item A" is similar to "Item B".
We will use **Keyword Overlap (Jaccard Similarity)**. It's simple and fast.

**Formula**:
`Similarity = (Shared Keywords) / (Total Unique Keywords)`

**Example**:
- **Lost Item**: "Black", "Backpack", "Nike"
- **Found Item**: "Blue", "Backpack", "Adidas"
- **Intersection** (Shared): "Backpack" (1 word)
- **Union** (Total Unique): "Black", "Backpack", "Nike", "Blue", "Adidas" (5 words)
- **Score**: 1 / 5 = **20% Match**.

---

## 4. How to Test Locally (Without Frontend)
Since you are working alone on AI, use the `test_client.py` script.

1.  **Start your Server**:
    ```bash
    uvicorn main:app --reload
    ```
2.  **Run the Test Script** (in a new terminal):
    ```bash
    python test_client.py
    ```
3.  **Check Output**: You should see JSON responses for both Image Analysis and Matching.

---

## 5. Deployment (Render/Railway)
We need this python script to run on the internet so the App can talk to it.
We will use **Render** (easiest free tier).

1.  Push code to GitHub.
2.  Sign up on [Render.com](https://render.com/).
3.  New **Web Service**.
4.  Connect GitHub repo -> Select `AIML` folder (Root Directory).
5.  **Build Command**: `pip install -r requirements.txt`
6.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
7.  **Environment Variables**:
    - **Issue**: Render doesn't have your `service_account.json` file.
    - **Fix**: Open `service_account.json`, copy the *entire content*, and add it as an Environment Variable named `GOOGLE_CREDENTIALS_JSON` in Render dashboard.

---

## 6. What to tell the Backend Team
Give them your Deployed URL (e.g., `https://lost2found-ai.onrender.com`).
Tell them the endpoints:
- **POST** `/analyze-image`: Send file forms-data `file`. Response: `{"labels": [...], "colors": [...]}`
- **POST** `/match-items`: Send JSON `{"target_item_labels": [], "candidates": []}`. Response: `[{"item_id": "...", "score": 80}, ...]`

---
