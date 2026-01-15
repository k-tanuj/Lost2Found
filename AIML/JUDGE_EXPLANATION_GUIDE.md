# 🎤 Judge Pitch Guide: Explaining the AI

Here is how to explain your code to non-technical and technical judges in 1 minute.

---

## 1. The "Hook" (What it does)
> *"Our AI doesn't just 'search text'. It **sees** the lost item. We use **Google Gemini 1.5 Flash** (Google's latest multimodal model) to analyze the image and understand exactly what is in it, down to the color and material."*

---

## 2. The Code Breakdown (main.py)

### Part A: The "Eyes" (`/analyze-image`)
**What you code does:**
1.  **Input**: Takes a raw photo from the user.
2.  **Processing**: Sends it to `google.generativeai` (Gemini).
3.  **Prompt Engineering**: We ask Gemini: *"Analyze this image... return 5 keywords and colors."*
4.  **Output**: Returns a clean JSON like `{"labels": ["Backpack", "School Bag"], "colors": ["Black"]}`.

**Why Gemini?**
> *"We chose Gemini over traditional Cloud Vision because it is context-aware. It knows a 'School Bag' is also a 'Backpack' without us writing manual rules."*

### Part B: The "Brain" (`/match-items`)
**What your code does:**
1.  **Input**: Takes the "Lost Item" tags and a list of all "Found Items".
2.  **Algorithm**: Uses **Jaccard Similarity** (Intersection over Union).
3.  **Math**:
    - If user lost a `Black Backpack`
    - And we found a `Red Backpack`
    - Similarity = 50% (Match on 'Backpack', miss on 'Color').
4.  **Output**: Returns the best matches sorted by score.

---

## 3. Key Technical Terms to Drop
- **Multimodal AI**: Because it understands both Images and Text.
- **FastAPI**: Used for high-performance, asynchronous Python backend.
- **Jaccard Similarity**: The specific algorithm used for keyword matching.
- **JSON REST API**: Standard architecture for connecting to the frontend.
