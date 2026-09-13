# routes/tryon.py
from flask import Blueprint, jsonify, request, current_app
from services.tryon_service import run_virtual_tryon_async, check_prediction_status

tryon_bp = Blueprint('tryon', __name__)


# POST /api/tryon
# Starts a virtual try-on job
# Body: { "person_image_url": "...", "product_id": "..." }
@tryon_bp.route('/tryon', methods=['POST'])
def start_tryon():
    data = request.get_json()

    # Validate inputs
    if not data:
        return jsonify({"success": False, "error": "Request body required"}), 400

    person_image_url = data.get('person_image_url')
    product_id = data.get('product_id')

    if not person_image_url or not product_id:
        return jsonify({
            "success": False,
            "error": "Both 'person_image_url' and 'product_id' are required"
        }), 400

    db = current_app.supabase

    # Fetch the product to get its image URL
    product_response = db.table("products").select("*").eq("id", product_id).execute()

    if not product_response.data:
        return jsonify({"success": False, "error": "Product not found"}), 404

    product = product_response.data[0]
    garment_image_url = product["image_url"]

    # Start async try-on job
    result = run_virtual_tryon_async(person_image_url, garment_image_url)

    if not result["success"]:
        return jsonify({"success": False, "error": result["error"]}), 500

    # Save try-on record to DB
    tryon_record = db.table("try_ons").insert({
        "product_id": product_id,
        "user_photo_url": person_image_url,
        "product_image_url": garment_image_url,
        "status": "processing",
        "replicate_prediction_id": result["prediction_id"]
    }).execute()

    return jsonify({
        "success": True,
        "message": "Try-on started! Poll the status endpoint every 3 seconds.",
        "prediction_id": result["prediction_id"],
        "tryon_id": tryon_record.data[0]["id"],
        "status": "processing",
        "product": {
            "name": product["name"],
            "brand": product["brand"]
        }
    }), 202  # 202 = Accepted (processing, not done yet)


# GET /api/tryon/<prediction_id>/status
# Check if try-on is done
@tryon_bp.route('/tryon/<prediction_id>/status', methods=['GET'])
def get_tryon_status(prediction_id):
    db = current_app.supabase

    # Check Replicate for current status
    result = check_prediction_status(prediction_id)

    if not result["success"]:
        return jsonify({"success": False, "error": result["error"]}), 500

    # If succeeded, update the DB record with the result URL
    if result["status"] == "succeeded" and result.get("result_url"):
        db.table("try_ons").update({
            "status": "done",
            "result_url": result["result_url"]
        }).eq("replicate_prediction_id", prediction_id).execute()

    # If failed, update DB
    if result["status"] == "failed":
        db.table("try_ons").update({
            "status": "failed"
        }).eq("replicate_prediction_id", prediction_id).execute()

    return jsonify({
        "success": True,
        "prediction_id": prediction_id,
        "status": result["status"],        # starting/processing/succeeded/failed
        "result_url": result.get("result_url"),  # None until succeeded
        "is_done": result["status"] in ["succeeded", "failed"]
    }), 200


# GET /api/tryon/history
# Returns all try-ons saved in DB
@tryon_bp.route('/tryon/history', methods=['GET'])
def get_tryon_history():
    db = current_app.supabase

    response = db.table("try_ons").select("*").order("created_at", desc=True).execute()

    return jsonify({
        "success": True,
        "count": len(response.data),
        "tryons": response.data
    }), 200
