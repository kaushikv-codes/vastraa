# models/product.py
# A "model" defines the shape of our data
# Think of it like a form template — every product must have these fields

class Product:
    def __init__(self, id, name, brand, price, category, occasion_tags, image_url):
        self.id = id
        self.name = name
        self.brand = brand
        self.price = price                    # Price in INR
        self.category = category              # "ethnic", "western", "fusion"
        self.occasion_tags = occasion_tags    # ["wedding", "festival"]
        self.image_url = image_url

    def to_dict(self):
        # Converts this Python object to a dictionary
        # We need this because APIs send JSON, not Python objects
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "price": self.price,
            "category": self.category,
            "occasion_tags": self.occasion_tags,
            "image_url": self.image_url
        }
