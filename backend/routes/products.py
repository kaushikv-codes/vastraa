# routes/products.py
from flask import Blueprint, jsonify, request
from models.product import Product

# Blueprint = a group of related routes
# Like a chapter in a book
products_bp = Blueprint('products', __name__)

# ---------- FAKE DATA (we'll replace with real DB in Week 2) ----------
# For now, we hardcode 5 products so we can test our API
PRODUCTS = [
    Product(
        id="1",
        name="Zari Embroidered Lehenga",
        brand="Kalki Fashion",
        price=8999,
        category="ethnic",
        occasion_tags=["wedding", "reception", "sangeet"],
        image_url="https://example.com/lehenga1.jpg"
    ),
    Product(
        id="2",
        name="Linen Printed Kurta Set",
        brand="FabIndia",
        price=2499,
        category="ethnic",
        occasion_tags=["office", "casual", "festival"],
        image_url="https://example.com/kurta1.jpg"
    ),
    Product(
        id="3",
        name="Floral Midi Dress",
        brand="Global Desi",
        price=1899,
        category="western",
        occasion_tags=["date-night", "casual", "beach"],
        image_url="https://example.com/dress1.jpg"
    ),
    Product(
        id="4",
        name="Silk Bandhani Saree",
        brand="Nalli Silks",
        price=5499,
        category="ethnic",
        occasion_tags=["wedding", "puja", "festival"],
        image_url="https://example.com/saree1.jpg"
    ),
    Product(
        id="5",
        name="Indo-Western Crop Top + Palazzo",
        brand="Aza Fashion",
        price=3799,
        category="fusion",
        occasion_tags=["sangeet", "cocktail", "date-night"],
        image_url="https://example.com/fusion1.jpg"
    ),
]
# -----------------------------------------------------------------------


# ROUTE 1: GET /api/products
# Returns ALL products
# "GET" means: "give me data" (reading, not writing)
@products_bp.route('/products', methods=['GET'])
def get_all_products():
    # Convert each Product object to a dictionary, then return as JSON
    products_list = [p.to_dict() for p in PRODUCTS]
    
    return jsonify({
        "success": True,
        "count": len(products_list),
        "products": products_list
    }), 200   # 200 = "OK, everything worked"


# ROUTE 2: GET /api/products/<id>
# Returns ONE product by its ID
@products_bp.route('/products/<product_id>', methods=['GET'])
def get_product_by_id(product_id):
    # Search through products to find the matching ID
    product = next((p for p in PRODUCTS if p.id == product_id), None)
    
    if product is None:
        # 404 = "Not Found"
        return jsonify({
            "success": False,
            "error": f"Product with id '{product_id}' not found"
        }), 404
    
    return jsonify({
        "success": True,
        "product": product.to_dict()
    }), 200


# ROUTE 3: GET /api/products?occasion=wedding
# Filter products by occasion
@products_bp.route('/products/search', methods=['GET'])
def search_products():
    # Get query parameters from URL (e.g., ?occasion=wedding&category=ethnic)
    occasion = request.args.get('occasion')     # e.g., "wedding"
    category = request.args.get('category')     # e.g., "ethnic"
    max_price = request.args.get('max_price')   # e.g., "5000"
    
    results = PRODUCTS  # Start with all products
    
    # Filter by occasion if provided
    if occasion:
        results = [p for p in results if occasion in p.occasion_tags]
    
    # Filter by category if provided
    if category:
        results = [p for p in results if p.category == category]
    
    # Filter by max price if provided
    if max_price:
        results = [p for p in results if p.price <= int(max_price)]
    
    return jsonify({
        "success": True,
        "filters_applied": {
            "occasion": occasion,
            "category": category,
            "max_price": max_price
        },
        "count": len(results),
        "products": [p.to_dict() for p in results]
    }), 200
