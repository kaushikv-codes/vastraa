# app.py — The heart of your Vastraa backend
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create the Flask application
app = Flask(__name__)

# CORS = Cross-Origin Resource Sharing
# This allows your frontend (Next.js on port 3000) to call your backend (Flask on port 5000)
# Without this, the browser would block the request for security reasons
CORS(app)

# Register our routes
# Blueprint pattern = keeps routes organized in separate files
from routes.products import products_bp
app.register_blueprint(products_bp, url_prefix='/api')
# url_prefix='/api' means all routes in products_bp become /api/products

# Health check route — always useful to verify the server is running
@app.route('/health')
def health_check():
    return {"status": "Vastraa backend is running! 🚀", "version": "1.0.0"}


# Run the server
if __name__ == '__main__':
    print("🚀 Vastraa Backend Starting...")
    print("📍 Running at: http://localhost:5000")
    print("📦 API base: http://localhost:5000/api")
    app.run(
        debug=os.getenv('FLASK_DEBUG', 'True') == 'True',
        port=5000
    )
