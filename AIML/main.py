import os
import json
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image
import io
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Lost2Found AI Service (Gemini Edition)")

# --- GEMINI SETUP ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def get_gemini_model():
    """Configures and returns the Gemini model."""
    if not GEMINI_API_KEY or "PASTE_YOUR" in GEMINI_API_KEY:
        print("⚠️ WARNING: GEMINI_API_KEY is missing or invalid in .env file.")
        return None
    
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel('gemini-flash-latest')

# --- MODELS ---
class MatchRequest(BaseModel):
    target_item_labels: List[str]
    target_item_description: str
    candidates: List[dict] 

# --- ROUTES ---

@app.get("/")
def home():
    return {"status": "AI Service Online", "model": "Google Gemini 1.5 Flash"}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Receives an image, sends it to Gemini, and returns labels/tags.
    """
    model = get_gemini_model()
    
    # Mock Mode if Key is missing
    if not model:
        return {
            "labels": ["Mock_Bag", "Mock_Black", "Mock_Gemini_Mode"],
            "colors": ["Black", "Grey"],
            "note": "⚠️ Key missing. Set GEMINI_API_KEY in .env"
        }

    try:
        # Read image
        content = await file.read()
        image = Image.open(io.BytesIO(content))

        # Prompt Gemini
        prompt = "Analyze this image of a lost item. Return a simple JSON object with 2 fields: 'labels' (list of 5-7 keywords describing the object, type, and material) and 'colors' (list of main colors). Do not use markdown code blocks."
        
        response = model.generate_content([prompt, image])
        
        # Clean up response (Gemini sometimes adds ```json ... ```)
        text_response = response.text.replace("```json", "").replace("```", "").strip()
        
        try:
            data = json.loads(text_response)
        except json.JSONDecodeError:
            # Fallback if JSON fails
            data = {"labels": ["Error parsing AI response"], "raw": text_response}

        return data

    except Exception as e:
        print(f"Error: {e}")
        # Return the actual error so we can debug it
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

@app.post("/match-items")
def match_items(req: MatchRequest):
    """
    Compares one 'target' item against a list of 'candidate' items (Text Matching).
    """
    target_tags = set([t.lower() for t in req.target_item_labels])
    results = []

    for item in req.candidates:
        candidate_tags = set([t.lower() for t in item.get("labels", [])])
        
        if not candidate_tags:
            score = 0
        else:
            # Jaccard Score
            intersection = target_tags.intersection(candidate_tags)
            union = target_tags.union(candidate_tags)
            score = len(intersection) / len(union) if len(union) > 0 else 0
        
        results.append({
            "item_id": item.get("id"),
            "score": round(score * 100, 2),
            "status": "Match Found" if score > 0.1 else "Low Similarity"
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
