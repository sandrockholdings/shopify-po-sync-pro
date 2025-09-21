/**
 * Suppliers API routes
 */

import express from 'express'
import { db } from '../lib/db.js'

const router = express.Router()

// GET /api/suppliers - Get all suppliers
router.get('/', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const suppliers = await db.client.supplier.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      data: suppliers
    })
  } catch (error) {
    console.error('Get suppliers error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get suppliers'
    })
  }
})

// GET /api/suppliers/:id - Get single supplier
router.get('/:id', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const supplier = await db.client.supplier.findFirst({
      where: { 
        id: req.params.id,
        merchantId: merchant.id 
      },
      include: {
        purchaseOrders: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      })
    }

    res.json({
      success: true,
      data: supplier
    })
  } catch (error) {
    console.error('Get supplier error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get supplier'
    })
  }
})

// POST /api/suppliers - Create new supplier
router.post('/', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const supplier = await db.client.supplier.create({
      data: {
        ...req.body,
        merchantId: merchant.id
      }
    })

    res.status(201).json({
      success: true,
      data: supplier
    })
  } catch (error) {
    console.error('Create supplier error:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Supplier name already exists'
      })
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create supplier'
    })
  }
})

// PUT /api/suppliers/:id - Update supplier
router.put('/:id', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    const supplier = await db.client.supplier.updateMany({
      where: { 
        id: req.params.id,
        merchantId: merchant.id 
      },
      data: req.body
    })

    if (supplier.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      })
    }

    // Fetch updated supplier
    const updatedSupplier = await db.client.supplier.findFirst({
      where: { 
        id: req.params.id,
        merchantId: merchant.id 
      }
    })

    res.json({
      success: true,
      data: updatedSupplier
    })
  } catch (error) {
    console.error('Update supplier error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update supplier'
    })
  }
})

// DELETE /api/suppliers/:id - Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const merchant = await db.getCurrentMerchant()
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'Merchant not found'
      })
    }

    // Check if supplier has purchase orders
    const poCount = await db.client.purchaseOrder.count({
      where: { 
        supplierId: req.params.id,
        merchantId: merchant.id 
      }
    })

    if (poCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete supplier with ${poCount} purchase orders. Archive it instead.`
      })
    }

    const supplier = await db.client.supplier.deleteMany({
      where: { 
        id: req.params.id,
        merchantId: merchant.id 
      }
    })

    if (supplier.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      })
    }

    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    })
  } catch (error) {
    console.error('Delete supplier error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete supplier'
    })
  }
})

export default router