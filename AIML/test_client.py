import requests
import json
import base64

# Configuration
API_URL = "http://127.0.0.1:8000"

def test_analyze_image():
    print("\n--- Testing /analyze-image ---")
    # Create a dummy image file (1x1 pixel black png) for testing if real one missing
    # In real usage, change 'test_image.png' to a path of a real image on your desktop
    dummy_image_content = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=")
    
    files = {'file': ('test.png', dummy_image_content, 'image/png')}
    
    try:
        response = requests.post(f"{API_URL}/analyze-image", files=files)
        if response.status_code == 200:
            print("✅ Success!")
            print("Response:", json.dumps(response.json(), indent=2))
        else:
            print("❌ Failed:", response.status_code, response.text)
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to {API_URL}. Is the server running?")

def test_match_items():
    print("\n--- Testing /match-items ---")
    
    payload = {
        "target_item_labels": ["Black", "Backpack", "School", "Bag"],
        "target_item_description": "Lost my black school bag",
        "candidates": [
             # Case 1: Good Match
            {"id": "item_1", "labels": ["Backpack", "Black", "Zipper", "School"]},
             # Case 2: Partial Match
            {"id": "item_2", "labels": ["Red", "Bag", "School"]},
             # Case 3: No Match
            {"id": "item_3", "labels": ["Shoe", "Nike", "Running"]}
        ]
    }
    
    try:
        response = requests.post(f"{API_URL}/match-items", json=payload)
        if response.status_code == 200:
            print("✅ Success!")
            print("Response:", json.dumps(response.json(), indent=2))
        else:
            print("❌ Failed:", response.status_code, response.text)
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to {API_URL}. Is the server running?")

if __name__ == "__main__":
    print("🚀 Starting Tests for Lost2Found AI Service...")
    test_analyze_image()
    test_match_items()
