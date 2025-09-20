import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Upload,
  FileText,
  Check,
  Warning,
  X,
  Eye
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ParsedItem {
  sku: string
  name: string
  quantity: number
  price: number
  confidence: number
}

interface ParsedPO {
  supplier: string
  poNumber: string
  date: string
  items: ParsedItem[]
  totalItems: number
  totalValue: number
  averageConfidence: number
}

export function POUpload() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [parsedData, setParsedData] = useState<ParsedPO | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }, [])

  const processFile = useCallback((file: File) => {
    setUploadedFile(file)
    setIsProcessing(true)
    setParsedData(null)
    setProcessingProgress(0)

    // Simulate AI processing with progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsProcessing(false)
          
          // Simulate parsed results
          const mockParsedData: ParsedPO = {
            supplier: 'TechnoSupply Co.',
            poNumber: 'PO-2024-' + Math.floor(Math.random() * 1000),
            date: new Date().toLocaleDateString(),
            totalItems: 5,
            totalValue: 2850.75,
            averageConfidence: 91,
            items: [
              { sku: 'TECH-001', name: 'Wireless Bluetooth Headphones', quantity: 10, price: 89.99, confidence: 95 },
              { sku: 'TECH-002', name: 'USB-C Charging Cable', quantity: 25, price: 12.99, confidence: 98 },
              { sku: 'TECH-003', name: 'Smartphone Case - Clear', quantity: 15, price: 24.99, confidence: 87 },
              { sku: 'TECH-004', name: 'Portable Power Bank 10000mAh', quantity: 8, price: 45.99, confidence: 92 },
              { sku: 'TECH-005', name: 'Wireless Charging Pad', quantity: 12, price: 34.99, confidence: 85 }
            ]
          }
          
          setParsedData(mockParsedData)
          toast.success('Purchase order processed successfully!')
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }, [])

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-success'
    if (confidence >= 85) return 'text-warning'
    return 'text-destructive'
  }

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 95) return 'default'
    if (confidence >= 85) return 'secondary'
    return 'destructive'
  }

  const handleApproveSync = () => {
    toast.success('Purchase order approved and synced to inventory!')
    // Reset state
    setUploadedFile(null)
    setParsedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClear = () => {
    setUploadedFile(null)
    setParsedData(null)
    setIsProcessing(false)
    setProcessingProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upload Purchase Order</h2>
        <p className="text-muted-foreground">
          Upload your supplier POs for AI-powered processing and inventory sync
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>
              Supports PDF, Excel, CSV, and image formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drop Zone */}
            <motion.div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver ? "border-primary bg-primary/5" : "border-border",
                uploadedFile && !isProcessing ? "border-success bg-success/5" : ""
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              animate={{ scale: isDragOver ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {!uploadedFile ? (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drop your PO here</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Or click to browse files
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    Choose File
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>AI Processing...</span>
                        <span>{Math.round(processingProgress)}%</span>
                      </div>
                      <Progress value={processingProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
            />
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              AI Processing Results
            </CardTitle>
            <CardDescription>
              Review and edit parsed data before syncing to inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {!parsedData ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Upload a purchase order to see AI processing results
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* PO Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Purchase Order Details</h3>
                      <Badge 
                        variant={getConfidenceBadgeVariant(parsedData.averageConfidence)}
                        className="gap-1"
                      >
                        <Check className="w-3 h-3" />
                        {parsedData.averageConfidence}% Confidence
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Supplier:</span>
                        <p className="text-muted-foreground">{parsedData.supplier}</p>
                      </div>
                      <div>
                        <span className="font-medium">PO Number:</span>
                        <p className="text-muted-foreground">{parsedData.poNumber}</p>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <p className="text-muted-foreground">{parsedData.date}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total Value:</span>
                        <p className="text-muted-foreground">${parsedData.totalValue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Items ({parsedData.totalItems})</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {parsedData.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{item.sku}</span>
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs", getConfidenceColor(item.confidence))}
                              >
                                {item.confidence}%
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {item.quantity} × ${item.price}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button onClick={handleApproveSync} className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Approve & Sync to Inventory
                    </Button>
                    <Button variant="outline" onClick={handleClear}>
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}