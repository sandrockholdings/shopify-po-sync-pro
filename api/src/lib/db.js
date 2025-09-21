/**
 * Database connection using existing Prisma client from orderflow-ai
 */

// Since we can't import the Prisma client directly from the other directory,
// we'll need to copy the essential database config and create a new Prisma client here
// This ensures proper module resolution and dependency management

import { PrismaClient } from '@prisma/client'

// Prisma client singleton
let prisma

// Initialize Prisma client
function initializePrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
      errorFormat: 'pretty'
    })

    // Handle graceful shutdown
    process.on('beforeExit', async () => {
      await prisma.$disconnect()
    })

    process.on('SIGINT', async () => {
      await prisma.$disconnect()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
  }

  return prisma
}

// Database utility functions
export const db = {
  // Get Prisma client instance
  get client() {
    return initializePrisma()
  },

  // Test database connection
  async testConnection() {
    try {
      await this.client.$queryRaw`SELECT 1`
      return { success: true, message: 'Database connection successful' }
    } catch (error) {
      console.error('Database connection failed:', error)
      return { success: false, error: error.message }
    }
  },

  // Get merchant (for RLS context)
  async getCurrentMerchant() {
    try {
      // For now, get the test merchant we created
      // In production, this would come from session/auth
      const merchant = await this.client.merchant.findFirst({
        where: { shopDomain: 'test-shop.myshopify.com' }
      })
      return merchant
    } catch (error) {
      console.error('Failed to get current merchant:', error)
      return null
    }
  },

  // Set merchant context for RLS (Row Level Security)
  async setMerchantContext(merchantId) {
    try {
      // This would set the RLS context in a real implementation
      // For now, we'll just return the merchant ID to use in queries
      return merchantId
    } catch (error) {
      console.error('Failed to set merchant context:', error)
      throw error
    }
  }
}

export default db