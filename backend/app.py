from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)
app.supabase = supabase

from routes.products import products_bp
from routes.style import style_bp
from routes.tryon import tryon_bp          # ← ADD THIS

app.register_blueprint(products_bp, url_prefix='/api')
app.register_blueprint(style_bp, url_prefix='/api')
app.register_blueprint(tryon_bp, url_prefix='/api')   # ← ADD THIS

@app.route('/health')
def health_check():
    return {
        "status": "Vastraa backend running 🚀",
        "database": "Supabase ✅",
        "ai_stylist": "Gemini ✅",
        "virtual_tryon": "Replicate ✅"
    }

if __name__ == '__main__':
    print("🚀 Vastraa Backend Starting...")
    print("📍 http://localhost:5000/api/products")
    print("🤖 http://localhost:5000/api/style-suggest/occasions")
    print("👗 http://localhost:5000/api/tryon")
    app.run(debug=True, port=5000)
