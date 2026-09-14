// src/routes/webhooks.js
// These are the URLs Shopify will call when products change

import express from 'express'
import supabase from '../services/supabase.js'
import { validateShopifyWebhook } from '../middleware/validateWebhook.js'

const router = express.Router()

// POST /webhooks/shopify/products/create
// Shopify calls this when a new product is created
router.post(
  '/shopify/products/create',
  validateShopifyWebhook,   // ← runs security check first
  async (req, res) => {
    try {
      const shopifyProduct = req.body   // product data from Shopify

      console.log(`📦 New product from Shopify: ${shopifyProduct.title}`)

      // Map Shopify's product format → our Vastraa products table format
      const vastraaProduct = {
        name: shopifyProduct.title,
        brand: shopifyProduct.vendor || 'Unknown Brand',
        price: parseFloat(shopifyProduct.variants?.[0]?.price || 0),
        category: mapShopifyCategory(shopifyProduct.product_type),
        occasion_tags: extractOccasionTags(shopifyProduct.tags),
        image_url: shopifyProduct.images?.[0]?.src || null,
        is_active: shopifyProduct.status === 'active'
      }

      // Save to Supabase
      // Same syntax as Python: supabase.table().insert().execute()
      const { data, error } = await supabase
        .from('products')
        .insert(vastraaProduct)
        .select()

      if (error) {
        console.error('❌ DB Error:', error)
        return res.status(500).json({ error: 'Failed to save product' })
      }

      console.log(`✅ Product saved to Vastraa DB: ${data[0].id}`)

      // Shopify expects a 200 response within 5 seconds
      // Otherwise it retries the webhook
      return res.status(200).json({
        success: true,
        message: 'Product synced to Vastraa',
        product_id: data[0].id
      })

    } catch (err) {
      console.error('❌ Webhook error:', err)
      return res.status(500).json({ error: err.message })
    }
  }
)


// POST /webhooks/shopify/products/update
// Shopify calls this when a product is updated
router.post(
  '/shopify/products/update',
  validateShopifyWebhook,
  async (req, res) => {
    try {
      const shopifyProduct = req.body

      console.log(`🔄 Product updated in Shopify: ${shopifyProduct.title}`)

      // Update existing product by matching name + brand
      const { data, error } = await supabase
        .from('products')
        .update({
          price: parseFloat(shopifyProduct.variants?.[0]?.price || 0),
          image_url: shopifyProduct.images?.[0]?.src || null,
          is_active: shopifyProduct.status === 'active'
        })
        .eq('name', shopifyProduct.title)
        .select()

      if (error) {
        return res.status(500).json({ error: 'Failed to update product' })
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated in Vastraa',
        updated: data.length
      })

    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }
)


// GET /webhooks/health
// Quick check that webhook service is running
router.get('/health', (req, res) => {
  res.json({
    status: 'Vastraa Webhook Service running ✅',
    port: process.env.PORT,
    endpoints: [
      'POST /webhooks/shopify/products/create',
      'POST /webhooks/shopify/products/update'
    ]
  })
})


// ── Helper Functions ──────────────────────────────────────

function mapShopifyCategory(productType) {
  // Map Shopify product types → Vastraa categories
  const type = (productType || '').toLowerCase()
  if (type.includes('saree') || type.includes('lehenga') || type.includes('kurta')) {
    return 'ethnic'
  } else if (type.includes('dress') || type.includes('top') || type.includes('jeans')) {
    return 'western'
  } else {
    return 'fusion'
  }
}

function extractOccasionTags(tagsString) {
  // Shopify tags are comma-separated: "wedding, ethnic, festive"
  if (!tagsString) return []
  const validOccasions = ['wedding', 'office', 'casual', 'festival', 'date-night', 'sangeet', 'cocktail', 'beach']
  const tags = tagsString.split(',').map(t => t.trim().toLowerCase())
  return tags.filter(tag => validOccasions.includes(tag))
}

export default router
