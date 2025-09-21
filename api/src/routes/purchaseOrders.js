/**
 * Purchase Orders API routes
 */

import express from 'express'
import { db } from '../lib/db.js'

const router = express.Router()

// GET /api/purchase-orders - Get purchase orders with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const {
      status,
      supplierId,
      dateFrom,
      dateTo,
      limit = '50',
      offset = '0'
    } = req.query

    // Build where clause
    const where = {
      merchantId: merchant.id
    }

    if (status) where.status = status
    if (supplierId) where.supplierId = supplierId
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    // Get orders and total count
    const [orders, total] = await Promise.all([
      db.client.purchaseOrder.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          lineItems: {
            select: {
              id: true,
              status: true
            }
          },
          _count: {
            select: {
              lineItems: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      db.client.purchaseOrder.count({ where })
    ])

    res.json({
      success: true,
      data: {
        orders,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    })
  } catch (error) {
    console.error('Get purchase orders error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get purchase orders'
    })
  }
})

// GET /api/purchase-orders/:id - Get single purchase order with full details
router.get('/:id', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const order = await db.client.purchaseOrder.findFirst({
      where: { 
        id: req.params.id,
        merchantId: merchant.id 
      },
      include: {
        supplier: true,
        lineItems: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      })
    }

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Get purchase order error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get purchase order'
    })
  }
})

// POST /api/purchase-orders - Create new purchase order
router.post('/', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const { lineItems, ...orderData } = req.body

    const order = await db.client.purchaseOrder.create({
      data: {
        ...orderData,
        merchantId: merchant.id,
        lineItems: lineItems ? {
          create: lineItems
        } : undefined
      },
      include: {
        supplier: true,
        lineItems: true
      }
    })

    res.status(201).json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Create purchase order error:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Purchase order number already exists'
      })
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create purchase order'
    })
  }
})

// PUT /api/purchase-orders/:id - Update purchase order
router.put('/:id', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const order = await db.client.purchaseOrder.updateMany({
      where: { 
        id: req.params.id,
        merchantId: merchant.id 
      },
      data: req.body
    })

    if (order.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      })
    }

    // Fetch updated order
    const updatedOrder = await db.client.purchaseOrder.findFirst({
      where: { 
        id: req.params.id,
        merchantId: merchant.id 
      },
      include: {
        supplier: true,
        lineItems: true
      }
    })

    res.json({
      success: true,
      data: updatedOrder
    })
  } catch (error) {
    console.error('Update purchase order error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update purchase order'
    })
  }
})

// DELETE /api/purchase-orders/:id - Delete purchase order
router.delete('/:id', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const order = await db.client.purchaseOrder.deleteMany({
      where: { 
        id: req.params.id,
        merchantId: merchant.id 
      }
    })

    if (order.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      })
    }

    res.json({
      success: true,
      message: 'Purchase order deleted successfully'
    })
  } catch (error) {
    console.error('Delete purchase order error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete purchase order'
    })
  }
})

export default router