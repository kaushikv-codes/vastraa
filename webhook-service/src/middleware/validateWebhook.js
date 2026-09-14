// src/middleware/validateWebhook.js
// Middleware = a function that runs BEFORE your route handler
// Like a security guard at the door

import crypto from 'crypto'

export function validateShopifyWebhook(req, res, next) {
  // Shopify sends their signature in this header
  const shopifySignature = req.headers['x-shopify-hmac-sha256']

  if (!shopifySignature) {
    console.log('❌ No Shopify signature found - rejecting request')
    return res.status(401).json({ error: 'Unauthorized - no signature' })
  }

  // Recreate the signature using YOUR secret + request body
  // If Shopify used the same secret, signatures will match
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  const body = req.rawBody  // raw request body (we capture this in server.js)

  const expectedSignature = crypto
    .createHmac('sha256', secret)   // create HMAC with SHA256 algorithm
    .update(body, 'utf8')           // feed the request body
    .digest('base64')               // output as base64 string

  // Compare signatures safely (prevents timing attacks)
  const isValid = crypto.timingSafeEqual(
    Buffer.from(shopifySignature, 'base64'),
    Buffer.from(expectedSignature, 'base64')
  )

  if (!isValid) {
    console.log('❌ Invalid signature - possible fake webhook')
    return res.status(401).json({ error: 'Unauthorized - invalid signature' })
  }

  console.log('✅ Webhook signature verified')
  next()  // signature is valid → pass to next function (route handler)
}
