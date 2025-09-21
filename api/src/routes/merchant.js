/**
 * Merchant API routes
 */

import express from 'express'
import { db } from '../lib/db.js'

const router = express.Router()

// GET /api/merchant - Get current merchant info
router.get('/', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    
    if (!merchant) {
      return res.status(404).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    res.json({
      success: true,
      data: merchant
    })
  } catch (error) {
    console.error('Get merchant error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get merchant information'
    })
  }
})

// PUT /api/merchant - Update merchant info
router.put('/', async (req, res) => {
  try {
    const currentMerchant = await db.getCurrentMerchant()
    
    if (!currentMerchant) {
      return res.status(404).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const updatedMerchant = await db.client.merchant.update({
      where: { id: currentMerchant.id },
      data: req.body
    })

    res.json({
      success: true,
      data: updatedMerchant
    })
  } catch (error) {
    console.error('Update merchant error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update merchant information'
    })
  }
})

export default router