# services/tryon_service.py
# MOCK VERSION — simulates Replicate try-on for development
# To use real Replicate later: just uncomment the real code below
# Architecture stays 100% the same

import uuid
import time

# Sample try-on result images (real fashion photos to simulate output)
MOCK_RESULTS = [
    "https://picsum.photos/seed/lehenga/400/600",
    "https://picsum.photos/seed/saree/400/600",
    "https://picsum.photos/seed/kurta/400/600",
    "https://picsum.photos/seed/dress/400/600",
]



# In-memory store for mock predictions
# { prediction_id: { status, result_url, created_at } }
_predictions = {}


def run_virtual_tryon_async(person_image_url: str, garment_image_url: str) -> dict:
    """
    MOCK: Starts a fake try-on job.
    Returns prediction_id immediately.
    Status changes to 'succeeded' after ~5 seconds when polled.
    """
    prediction_id = f"mock_{uuid.uuid4().hex[:12]}"

    # Store prediction with timestamp
    _predictions[prediction_id] = {
        "status": "starting",
        "created_at": time.time(),
        # Pick a mock result based on garment URL
        "result_url": MOCK_RESULTS[hash(garment_image_url) % len(MOCK_RESULTS)]
    }

    print(f"🎭 Mock try-on started: {prediction_id}")

    return {
        "success": True,
        "prediction_id": prediction_id,
        "status": "starting"
    }


def check_prediction_status(prediction_id: str) -> dict:
    """
    MOCK: Simulates job progression.
    starting → processing (after 3s) → succeeded (after 8s)
    """
    if prediction_id not in _predictions:
        return {"success": False, "error": "Prediction not found"}

    prediction = _predictions[prediction_id]
    elapsed = time.time() - prediction["created_at"]

    # Simulate status progression over time
    if elapsed < 3:
        status = "starting"
    elif elapsed < 8:
        status = "processing"
    else:
        status = "succeeded"

    result = {
        "success": True,
        "prediction_id": prediction_id,
        "status": status,
        "is_done": status in ["succeeded", "failed"]
    }

    if status == "succeeded":
        result["result_url"] = prediction["result_url"]
        print(f"✅ Mock try-on complete: {prediction_id}")

    return result


# ─────────────────────────────────────────────────────────────
# REAL REPLICATE CODE (uncomment when you have credits):
# ─────────────────────────────────────────────────────────────
# import replicate
# import os
#
# def run_virtual_tryon_async(person_image_url, garment_image_url):
#     prediction = replicate.predictions.create(
#         version="906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f",
#         input={
#             "garm_img": garment_image_url,
#             "human_img": person_image_url,
#             "garment_des": "Indian ethnic garment",
#             "is_checked": True,
#             "denoise_steps": 30,
#             "seed": 42
#         }
#     )
#     return {"success": True, "prediction_id": prediction.id, "status": prediction.status}
#
# def check_prediction_status(prediction_id):
#     prediction = replicate.predictions.get(prediction_id)
#     result = {"success": True, "prediction_id": prediction_id, "status": prediction.status}
#     if prediction.status == "succeeded":
#         result["result_url"] = prediction.output[0]
#     return result
