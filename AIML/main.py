import os
import json
import math
from datetime import datetime
from typing import List, Dict
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image
import io
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Lost2Found AI Service (Gemini + Explainable Logic)")

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
    target_item: Dict # {labels: [], description: "", category: "", lat: float, lng: float, date: str}
    candidates: List[Dict] # [{id, labels: [], description: "", category: "", lat: float, lng: float, date: str}, ...]

# --- HELPER FUNCTIONS ---

def calculate_distance(lat1, lon1, lat2, lon2):
    """Haversine formula to calculate distance in meters."""
    if lat1 == 0 or lat2 == 0: return float('inf') # Invalid location
    R = 6371e3 # Earth radius in meters
    phi1 = lat1 * math.pi / 180
    phi2 = lat2 * math.pi / 180
    delta_phi = (lat2 - lat1) * math.pi / 180
    delta_lambda = (lon2 - lon1) * math.pi / 180

    a = math.sin(delta_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def calculate_time_score(time1_str, time2_str):
    """Returns score based on proximity in time (higher if closer)."""
    if not time1_str or not time2_str: return 0
    try:
        t1 = datetime.fromisoformat(time1_str.replace('Z', '+00:00'))
        t2 = datetime.fromisoformat(time2_str.replace('Z', '+00:00'))
        diff_hours = abs((t1 - t2).total_seconds()) / 3600
        
        # Scoring: 100% if within 1 hour, decays to 0% over 7 days (168 hours)
        score = max(0, 1 - (diff_hours / 168))
        return score
    except:
        return 0

# --- ROUTES ---

@app.get("/")
def home():
    return {"status": "AI Service Online", "logic": "Explainable AI Match v2"}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Receives an image, sends it to Gemini, and returns labels/tags.
    """
    model = get_gemini_model()
    
    # Mock Mode if Key is missing
    if not model:
        return {
            "labels": ["Mock_Item", "Mock_Color"],
            "category": "Electronics",
            "description": "Mock description because API key is missing."
        }

    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content))

        prompt = """
        Analyze this lost item. Return JSON:
        {
            "labels": ["list", "of", "5", "keywords"],
            "category": "one_word_category (Electronics, Clothing, ID, Keys, Wallet, Other)",
            "description": "Short visual description (max 20 words)",
            "colors": ["MainColor", "SecondaryColor"]
        }
        """
        
        response = model.generate_content([prompt, image])
        text_response = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text_response)
        return data

    except Exception as e:
        print(f"Error: {e}")
        return {"labels": [], "error": str(e)}

@app.post("/match-items")
def match_items(req: MatchRequest):
    """
    Explainable AI Matching Logic.
    Weights: Image/Labels (40%), Metadata (30%), Location (20%), Time (10%)
    """
    target = req.target_item
    target_tags = set([t.lower() for t in target.get("labels", [])])
    target_cat = target.get("category", "").lower()
    
    results = []

    for item in req.candidates:
        explanation = []
        
        # 1. Label/Image Similarity (40%)
        candidate_tags = set([t.lower() for t in item.get("labels", [])])
        if not candidate_tags:
            label_score = 0
        else:
            intersection = target_tags.intersection(candidate_tags)
            union = target_tags.union(candidate_tags)
            label_score = len(intersection) / len(union) if union else 0
        
        if label_score > 0.3: explanation.append(f"Visual Match ({int(label_score*100)}%)")

        # 2. Metadata Similarity (30%)
        meta_score = 0
        candidate_cat = item.get("category", "").lower()
        if target_cat and candidate_cat:
             if target_cat == candidate_cat or target_cat in candidate_cat or candidate_cat in target_cat:
                meta_score = 1.0
                explanation.append(f"Same Category ({target_cat})")
        
        # 3. Location Proximity (20%)
        # Check for Text Match first (since Map is removed)
        target_loc_text = target.get("location", "") or target.get("locationText", "")
        candidate_loc_text = item.get("location", "") or item.get("locationText", "")
        
        loc_score = 0
        dist = float('inf') 
        
        # Bidirectional fuzzy text match for location
        if target_loc_text and candidate_loc_text:
            t_loc = target_loc_text.lower()
            c_loc = candidate_loc_text.lower()
            if t_loc in c_loc or c_loc in t_loc:
                loc_score = 1.0
                explanation.append(f"Same Location ({target_loc_text})")
        
        if loc_score == 0:
            # Fallback to Coordinates if they exist (Legacy support)
            dist = calculate_distance(target.get("lat", 0), target.get("lng", 0), 
                                      item.get("lat", 0), item.get("lng", 0))
            
            if dist < 100: # Within 100m
                loc_score = 1.0
                explanation.append("Very Close Location (<100m)")
            elif dist < 500: # Within 500m
                loc_score = 0.5
                explanation.append("Nearby (<500m)")

        # 4. Time Overlap (10%)
        time_score = calculate_time_score(target.get("date"), item.get("date"))
        if time_score > 0.8: explanation.append("Found recently")

        # FINAL SCORE CALCULATION
        final_score = (
            (label_score * 0.40) +
            (meta_score * 0.30) +
            (loc_score * 0.20) +
            (time_score * 0.10)
        )
        # DEBUG LOGGING
        print(f"Comparing Target vs {item.get('id')}:")
        print(f"  - Labels: {target_tags} vs {candidate_tags} -> Score: {label_score}")
        print(f"  - Category: {target_cat} vs {candidate_cat} -> Score: {meta_score}")
        print(f"  - Location: {target_loc_text} vs {candidate_loc_text} -> Score: {loc_score}")
        print(f"  - Final: {final_score}")

        if final_score > 0.01: # Ultra-low threshold for debugging
            results.append({
                "item_id": item.get("id"),
                "score": round(final_score * 100, 1),
                "reason": " + ".join(explanation),
                "details": {
                    "image_score": round(label_score, 2),
                    "meta_score": math.floor(meta_score), 
                    "location_distance": f"{int(dist)}m" if dist < 1000000 else "N/A"
                }
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
