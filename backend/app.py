from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Connect to Supabase
# create_client takes your URL and API key from .env
# This is your database connection — like opening a door to the DB
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Make supabase available to all routes
app.supabase = supabase

from routes.products import products_bp
from routes.style import style_bp          # ← ADD THIS LINE

app.register_blueprint(products_bp, url_prefix='/api')
app.register_blueprint(style_bp, url_prefix='/api')   # ← ADD THIS LINE

@app.route('/health')
def health_check():
    return {"status": "Vastraa backend is running! 🚀", "database": "Supabase connected ✅"}

if __name__ == '__main__':
    print("🚀 Vastraa Backend Starting...")
    print("📍 Open: http://localhost:5000/api/products")
    app.run(debug=True, port=5000)
