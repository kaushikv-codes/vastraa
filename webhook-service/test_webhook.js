// test_webhook.js — simulates Shopify sending a webhook
import crypto from 'crypto'

const SECRET = 'vastraa_dev_secret_2024'
const URL = 'http://localhost:5001/webhooks/shopify/products/create'

// Fake Shopify product payload
const product = {
  title: "Bandhani Print Georgette Saree",
  vendor: "Rajasthani Crafts",
  product_type: "Saree",
  status: "active",
  tags: "wedding, festival, ethnic",
  variants: [{ price: "3499.00" }],
  images: [{ src: "https://via.placeholder.com/400x600/FF69B4/FFFFFF?text=Saree" }]
}

const body = JSON.stringify(product)

// Generate HMAC signature (same as Shopify would do)
const signature = crypto
  .createHmac('sha256', SECRET)
  .update(body, 'utf8')
  .digest('base64')

// Send the fake webhook
const response = await fetch(URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-shopify-hmac-sha256': signature   // ← Shopify always sends this
  },
  body: body
})

const result = await response.json()
console.log('Response:', result)
