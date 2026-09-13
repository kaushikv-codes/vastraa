# test_api.py
# Run this to test all your API endpoints
# Usage: python test_api.py

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def print_response(label, response):
    print(f"\n{'='*50}")
    print(f"✅ {label}")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

# ─── TEST 1: Health Check ───────────────────────────────
print("\n🔍 Testing Health...")
r = requests.get(f"{BASE_URL}/health")
print_response("Health Check", r)

# ─── TEST 2: Get All Products ───────────────────────────
print("\n🔍 Testing Products...")
r = requests.get(f"{BASE_URL}/api/products")
print_response("All Products", r)

# Save first product ID for try-on test
products = r.json().get("products", [])
first_product = products[0] if products else None

# ─── TEST 3: Search by Occasion ─────────────────────────
r = requests.get(f"{BASE_URL}/api/products/search?occasion=wedding")
print_response("Search: occasion=wedding", r)

# ─── TEST 4: AI Style Suggest ───────────────────────────
print("\n🔍 Testing AI Stylist...")
r = requests.post(f"{BASE_URL}/api/style-suggest", json={
    "occasion": "festival",
    "budget": 3000,
    "preferences": "ethnic wear"
})
print_response("AI Style Suggest", r)

# ─── TEST 5: Virtual Try-On ─────────────────────────────
if first_product:
    print(f"\n🔍 Testing Try-On with product: {first_product['name']}...")
    r = requests.post(f"{BASE_URL}/api/tryon", json={
        "person_image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Gown_0001.jpg/400px-Gown_0001.jpg",
        "product_id": first_product["id"]
    })
    print_response("Start Try-On", r)

    prediction_id = r.json().get("prediction_id")

    if prediction_id:
        print(f"\n⏳ Polling status for prediction: {prediction_id}")
        print("(This takes 20-60 seconds, checking every 5 seconds...)\n")

        for i in range(20):  # max 20 attempts = 100 seconds
            time.sleep(5)
            r = requests.get(f"{BASE_URL}/api/tryon/{prediction_id}/status")
            status_data = r.json()
            status = status_data.get("status")
            print(f"  Attempt {i+1}: status = {status}")

            if status == "succeeded":
                print(f"\n🎉 TRY-ON COMPLETE!")
                print(f"Result URL: {status_data.get('result_url')}")
                print("Open that URL in your browser to see the try-on image!")
                break
            elif status == "failed":
                print(f"\n❌ Try-on failed")
                break
        else:
            print("\n⏱️ Timed out — try polling manually")
