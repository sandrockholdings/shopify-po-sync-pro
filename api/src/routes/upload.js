/**
 * File Upload API routes
 */

import express from 'express'
import multer from 'multer'
import { db } from '../lib/db.js'
import path from 'path'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and Excel files are allowed.'))
    }
  }
})

// POST /api/upload/po-file - Upload PO file
router.post('/po-file', upload.single('file'), async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      })
    }

    const { autoProcess = 'true', supplierId } = req.body
    
    // Generate upload ID
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // In a real implementation, you would:
    // 1. Save file to storage (S3, local filesystem, etc.)
    // 2. Store file metadata in database
    // 3. Queue for processing if autoProcess is true
    
    // For now, we'll simulate this
    const fileInfo = {
      uploadId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      merchantId: merchant.id,
      supplierId: supplierId || null,
      status: 'uploaded',
      uploadedAt: new Date()
    }

    // Store in a temporary storage simulation
    // In production, this would go to a proper queue/database
    global.uploadStorage = global.uploadStorage || {}
    global.uploadStorage[uploadId] = {
      ...fileInfo,
      buffer: req.file.buffer
    }

    res.json({
      success: true,
      data: {
        uploadId,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        status: 'uploaded'
      },
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('Upload error:', error)
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB'
      })
    }
    res.status(500).json({
      success: false,
      error: 'File upload failed'
    })
  }
})

// GET /api/upload/:uploadId/status - Get upload status
router.get('/:uploadId/status', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const { uploadId } = req.params
    
    // Check temporary storage
    global.uploadStorage = global.uploadStorage || {}
    const upload = global.uploadStorage[uploadId]
    
    if (!upload || upload.merchantId !== merchant.id) {
      return res.status(404).json({
        success: false,
        error: 'Upload not found'
      })
    }

    res.json({
      success: true,
      data: {
        uploadId,
        fileName: upload.fileName,
        fileSize: upload.fileSize,
        status: upload.status,
        uploadedAt: upload.uploadedAt
      }
    })
  } catch (error) {
    console.error('Get upload status error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get upload status'
    })
  }
})

export default router