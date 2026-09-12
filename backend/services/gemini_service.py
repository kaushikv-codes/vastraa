# services/gemini_service.py
from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# New SDK — uses Client instead of configure()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def get_style_suggestions(occasion: str, budget: int, preferences: str = "") -> dict:
    prompt = f"""
You are Vastraa's AI fashion stylist specializing in Indian fashion.

A customer needs outfit help:
- Occasion: {occasion}
- Budget: ₹{budget} total
- Preferences: {preferences if preferences else "No specific preferences"}

Suggest 3 outfit options. Respond ONLY with valid JSON, no other text:
{{
  "occasion": "{occasion}",
  "budget": {budget},
  "suggestions": [
    {{
      "outfit_name": "Name of the complete look",
      "description": "Brief description and why it works for {occasion}",
      "items": [
        {{
          "category": "ethnic/western/fusion",
          "item_type": "e.g. lehenga, saree, kurta, dress",
          "color_suggestion": "e.g. navy blue",
          "price_range": "e.g. ₹2000-3000",
          "occasion_fit": "why this works for {occasion}"
        }}
      ],
      "total_estimated_price": "e.g. ₹4500",
      "styling_tip": "One quick styling tip"
    }}
  ],
  "general_advice": "One overall fashion tip for {occasion}"
}}
"""

    try:
        # New SDK syntax
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        raw_text = response.text.strip()

        # Clean up if Gemini wraps in ```json ... ```
        if "```" in raw_text:
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]

        suggestions = json.loads(raw_text)
        return {"success": True, "data": suggestions}

    except json.JSONDecodeError:
        return {"success": True, "data": {"raw_response": response.text}}
    except Exception as e:
        return {"success": False, "error": str(e)}
