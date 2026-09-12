# routes/style.py
from flask import Blueprint, jsonify, request, current_app
from services.gemini_service import get_style_suggestions

style_bp = Blueprint('style', __name__)


# POST /api/style-suggest
# Body: { "occasion": "wedding", "budget": 5000, "preferences": "ethnic wear" }
@style_bp.route('/style-suggest', methods=['POST'])
def suggest_style():
    # Get JSON body from request
    data = request.get_json()

    # Validate required fields
    if not data or not data.get('occasion'):
        return jsonify({
            "success": False,
            "error": "Please provide 'occasion' in request body"
        }), 400

    occasion = data.get('occasion')           # e.g. "wedding"
    budget = data.get('budget', 3000)         # default ₹3000 if not provided
    preferences = data.get('preferences', '') # optional

    # Call Gemini AI
    result = get_style_suggestions(occasion, budget, preferences)

    if not result["success"]:
        return jsonify({"success": False, "error": result["error"]}), 500

    # After getting AI suggestions, find matching products from our DB
    db = current_app.supabase
    ai_data = result["data"]

    # Get all products to match with AI suggestions
    products_response = db.table("products").select("*").eq("is_active", True).execute()
    all_products = products_response.data

    # Match AI suggested item_types with real products in our DB
    matched_products = []
    if "suggestions" in ai_data:
        for suggestion in ai_data["suggestions"]:
            for item in suggestion.get("items", []):
                item_type = item.get("item_type", "").lower()
                category = item.get("category", "").lower()

                # Find products that match the suggested type or category
                matches = [
                    p for p in all_products
                    if category in p.get("category", "").lower()
                    or any(item_type in tag for tag in p.get("occasion_tags", []))
                ]
                matched_products.extend(matches[:2])  # max 2 per item

    # Remove duplicate products
    seen_ids = set()
    unique_products = []
    for p in matched_products:
        if p["id"] not in seen_ids:
            seen_ids.add(p["id"])
            unique_products.append(p)

    return jsonify({
        "success": True,
        "ai_suggestions": ai_data,
        "matching_products": unique_products,
        "total_matches": len(unique_products)
    }), 200


# GET /api/style-suggest/occasions
# Returns list of supported occasions
@style_bp.route('/style-suggest/occasions', methods=['GET'])
def get_occasions():
    occasions = [
        {"id": "wedding", "label": "Wedding", "emoji": "💍"},
        {"id": "office", "label": "Office / Work", "emoji": "💼"},
        {"id": "festival", "label": "Festival / Puja", "emoji": "🪔"},
        {"id": "date-night", "label": "Date Night", "emoji": "✨"},
        {"id": "casual", "label": "Casual Outing", "emoji": "☀️"},
        {"id": "sangeet", "label": "Sangeet / Mehendi", "emoji": "💃"},
        {"id": "cocktail", "label": "Cocktail Party", "emoji": "🥂"},
        {"id": "beach", "label": "Beach / Vacation", "emoji": "🏖️"},
    ]
    return jsonify({"success": True, "occasions": occasions}), 200
