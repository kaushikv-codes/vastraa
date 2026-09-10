from flask import Blueprint, jsonify, request, current_app

products_bp = Blueprint('products', __name__)


# Helper: get supabase client from app
def get_db():
    return current_app.supabase


# ROUTE 1: GET /api/products
# Fetches ALL products from Supabase DB
@products_bp.route('/products', methods=['GET'])
def get_all_products():
    db = get_db()

    # .table("products") = which table
    # .select("*")       = all columns (like SELECT * in SQL)
    # .execute()         = run the query
    response = db.table("products").select("*").execute()

    return jsonify({
        "success": True,
        "count": len(response.data),
        "products": response.data   # response.data = list of dicts from DB
    }), 200


# ROUTE 2: GET /api/products/<id>
# Fetch ONE product by its UUID
@products_bp.route('/products/<product_id>', methods=['GET'])
def get_product_by_id(product_id):
    db = get_db()

    # .eq("id", product_id) = WHERE id = product_id
    response = db.table("products").select("*").eq("id", product_id).execute()

    if not response.data:
        return jsonify({"success": False, "error": "Product not found"}), 404

    return jsonify({
        "success": True,
        "product": response.data[0]  # [0] because .eq returns a list
    }), 200


# ROUTE 3: GET /api/products/search?occasion=wedding&category=ethnic&max_price=5000
# Filter products from DB using query parameters
@products_bp.route('/products/search', methods=['GET'])
def search_products():
    db = get_db()

    occasion = request.args.get('occasion')
    category = request.args.get('category')
    max_price = request.args.get('max_price')

    # Start building the query
    query = db.table("products").select("*").eq("is_active", True)

    # Add filters only if the parameter was provided
    if category:
        # .eq() = WHERE category = 'ethnic'
        query = query.eq("category", category)

    if max_price:
        # .lte() = WHERE price <= max_price  (less than or equal)
        query = query.lte("price", int(max_price))

    if occasion:
        # .contains() = WHERE 'wedding' = ANY(occasion_tags)
        query = query.contains("occasion_tags", [occasion])

    response = query.execute()

    return jsonify({
        "success": True,
        "filters": {"occasion": occasion, "category": category, "max_price": max_price},
        "count": len(response.data),
        "products": response.data
    }), 200
