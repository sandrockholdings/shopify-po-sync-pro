/**
 * API Server for Shopify PO Sync Pro
 * Provides REST endpoints for the React frontend to communicate with the database
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config({ path: '../orderflow-ai/.env' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.API_PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Import routes
import merchantRoutes from './routes/merchant.js'
import supplierRoutes from './routes/suppliers.js'
import purchaseOrderRoutes from './routes/purchaseOrders.js'
import lineItemRoutes from './routes/lineItems.js'
import aiSettingsRoutes from './routes/aiSettings.js'
import uploadRoutes from './routes/upload.js'
import analyticsRoutes from './routes/analytics.js'
import shopifyRoutes from './routes/shopify.js'

// API Routes
app.use('/api/merchant', merchantRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/purchase-orders', purchaseOrderRoutes)
app.use('/api/line-items', lineItemRoutes)
app.use('/api/ai-settings', aiSettingsRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/shopify', shopifyRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} not found`
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error)
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})