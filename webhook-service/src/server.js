// src/server.js
// Entry point for the Node.js webhook service
// Compare with Python's app.py — same concept, different syntax

import express from 'express'
import dotenv from 'dotenv'
import webhookRoutes from './routes/webhooks.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// ── Middleware Setup ──────────────────────────────────────
// IMPORTANT: We need raw body for HMAC signature verification
// express.json() normally parses body → we also save the raw version
app.use((req, res, next) => {
  let rawBody = ''
  req.on('data', chunk => { rawBody += chunk })
  req.on('end', () => {
    req.rawBody = rawBody          // save raw string for signature check
    try {
      req.body = JSON.parse(rawBody || '{}')  // also parse as JSON
    } catch {
      req.body = {}
    }
    next()
  })
})

// CORS — allow requests from your Flask backend and frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-shopify-hmac-sha256')
  next()
})

// ── Routes ────────────────────────────────────────────────
app.use('/webhooks', webhookRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({
    service: 'Vastraa Webhook Service',
    version: '1.0.0',
    status: 'running'
  })
})

// ── Start Server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Webhook service running on port ${PORT}`)
  console.log(`📍 Health: http://localhost:${PORT}/webhooks/health`)
  console.log(`🔗 Shopify Create: POST http://localhost:${PORT}/webhooks/shopify/products/create`)
  console.log(`🔗 Shopify Update: POST http://localhost:${PORT}/webhooks/shopify/products/update`)
})
