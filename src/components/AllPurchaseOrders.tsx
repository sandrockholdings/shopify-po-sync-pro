import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  MagnifyingGlass, 
  FunnelSimple,
  DownloadSimple,
  Eye,
  Calendar,
  Check,
  Clock,
  Warning,
  X,
  FileText,
  Package,
  TrendUp,
  Robot,
  Lightning,
  ChartLineUp,
  CaretDown,
  CaretUp,
  SortAscending,
  SortDescending,
  ArrowsClockwise
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface PurchaseOrderItem {
  id: string
  sku: string
  name: string
  quantity: number
  unitCost: number
  totalCost: number
  confidence: number
  status: 'matched' | 'new' | 'updated' | 'error' | 'review_needed'
}

interface PurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  uploadDate: string
  processedDate?: string
  status: 'processing' | 'completed' | 'failed' | 'review_needed'
  totalItems: number
  totalValue: number
  confidence: number
  items: PurchaseOrderItem[]
  fileName: string
  fileSize: number
  aiAnalysis?: {
    detectedFields: number
    extractionAccuracy: number
    suggestedMappings: number
    flaggedItems: number
  }
}

interface AllPurchaseOrdersProps {
  onBack: () => void
}

export function AllPurchaseOrders({ onBack }: AllPurchaseOrdersProps) {
  const [purchaseOrders] = useKV<PurchaseOrder[]>('all-purchase-orders', [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      supplier: 'TechnoSupply Co.',
      uploadDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      processedDate: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      totalItems: 24,
      totalValue: 4850.00,
      confidence: 95,
      fileName: 'techno-supply-po-001.pdf',
      fileSize: 2400000,
      items: [
        { id: '1-1', sku: 'TS-001', name: 'Wireless Headphones Pro', quantity: 12, unitCost: 85.00, totalCost: 1020.00, confidence: 98, status: 'matched' },
        { id: '1-2', sku: 'TS-002', name: 'Bluetooth Speaker X1', quantity: 8, unitCost: 125.50, totalCost: 1004.00, confidence: 94, status: 'updated' },
        { id: '1-3', sku: 'TS-003', name: 'Smart Watch Elite', quantity: 4, unitCost: 199.99, totalCost: 799.96, confidence: 96, status: 'matched' }
      ],
      aiAnalysis: {
        detectedFields: 18,
        extractionAccuracy: 95,
        suggestedMappings: 24,
        flaggedItems: 1
      }
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      supplier: 'Premier Wholesale',
      uploadDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'processing',
      totalItems: 16,
      totalValue: 2340.50,
      confidence: 87,
      fileName: 'premier-wholesale-batch-02.xlsx',
      fileSize: 850000,
      items: [
        { id: '2-1', sku: 'PW-101', name: 'Gaming Mouse RGB', quantity: 15, unitCost: 45.00, totalCost: 675.00, confidence: 91, status: 'matched' },
        { id: '2-2', sku: 'PW-102', name: 'Mechanical Keyboard', quantity: 8, unitCost: 89.99, totalCost: 719.92, confidence: 83, status: 'review_needed' }
      ],
      aiAnalysis: {
        detectedFields: 14,
        extractionAccuracy: 87,
        suggestedMappings: 16,
        flaggedItems: 3
      }
    },
    {
      id: '3',
      poNumber: 'PO-2024-003',
      supplier: 'Global Electronics',
      uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      processedDate: new Date(Date.now() - 2.8 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'failed',
      totalItems: 0,
      totalValue: 0,
      confidence: 0,
      fileName: 'global-electronics-corrupted.pdf',
      fileSize: 1200000,
      items: [],
      aiAnalysis: {
        detectedFields: 2,
        extractionAccuracy: 15,
        suggestedMappings: 0,
        flaggedItems: 0
      }
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [supplierFilter, setSupplierFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<string>('uploadDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Filter and sort purchase orders
  const filteredAndSortedPOs = (purchaseOrders || [])
    .filter(po => {
      const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           po.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           po.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || po.status === statusFilter
      const matchesSupplier = supplierFilter === 'all' || po.supplier === supplierFilter
      return matchesSearch && matchesStatus && matchesSupplier
    })
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof PurchaseOrder]
      let bValue: any = b[sortField as keyof PurchaseOrder]
      
      if (sortField === 'uploadDate' || sortField === 'processedDate') {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })

  // Get unique suppliers for filter
  const uniqueSuppliers = Array.from(new Set((purchaseOrders || []).map(po => po.supplier)))

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/10 text-success border-success/20"><Check className="w-3 h-3 mr-1" />Completed</Badge>
      case 'processing':
        return <Badge className="bg-primary/10 text-primary border-primary/20"><Clock className="w-3 h-3 mr-1" />Processing</Badge>
      case 'review_needed':
        return <Badge className="bg-warning/10 text-warning border-warning/20"><Warning className="w-3 h-3 mr-1" />Review Needed</Badge>
      case 'failed':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <SortAscending className="w-4 h-4 opacity-50" />
    return sortDirection === 'asc' ? <SortAscending className="w-4 h-4" /> : <SortDescending className="w-4 h-4" />
  }

  const getTotalStats = () => {
    const total = filteredAndSortedPOs.length
    const completed = filteredAndSortedPOs.filter(po => po.status === 'completed').length
    const processing = filteredAndSortedPOs.filter(po => po.status === 'processing').length
    const failed = filteredAndSortedPOs.filter(po => po.status === 'failed').length
    const totalValue = filteredAndSortedPOs.reduce((sum, po) => sum + po.totalValue, 0)
    const avgConfidence = filteredAndSortedPOs.reduce((sum, po) => sum + po.confidence, 0) / (total || 1)

    return { total, completed, processing, failed, totalValue, avgConfidence }
  }

  const stats = getTotalStats()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">All Purchase Orders</h2>
            <p className="text-muted-foreground">Manage and review all your uploaded purchase orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <DownloadSimple className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <ArrowsClockwise className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total POs</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{stats.processing}</div>
            <div className="text-xs text-muted-foreground">Processing</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{formatCurrency(stats.totalValue)}</div>
            <div className="text-xs text-muted-foreground">Total Value</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-muted/30 to-muted/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{Math.round(stats.avgConfidence)}%</div>
            <div className="text-xs text-muted-foreground">Avg Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by PO number, supplier, or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="review_needed">Review Needed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {uniqueSuppliers.map(supplier => (
                <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Purchase Orders ({filteredAndSortedPOs.length})
          </CardTitle>
          <CardDescription>
            Click on any purchase order to view detailed information and processing results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('poNumber')}>
                    <div className="flex items-center gap-2">
                      PO Number
                      {getSortIcon('poNumber')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('supplier')}>
                    <div className="flex items-center gap-2">
                      Supplier
                      {getSortIcon('supplier')}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('uploadDate')}>
                    <div className="flex items-center gap-2">
                      Upload Date
                      {getSortIcon('uploadDate')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort('totalItems')}>
                    <div className="flex items-center gap-2 justify-end">
                      Items
                      {getSortIcon('totalItems')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort('totalValue')}>
                    <div className="flex items-center gap-2 justify-end">
                      Value
                      {getSortIcon('totalValue')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort('confidence')}>
                    <div className="flex items-center gap-2 justify-end">
                      AI Confidence
                      {getSortIcon('confidence')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPOs.map((po) => (
                  <TableRow key={po.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="w-4 h-4 text-primary" />
                        </div>
                        {po.supplier}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(po.status)}</TableCell>
                    <TableCell>{formatDate(po.uploadDate)}</TableCell>
                    <TableCell className="text-right">{po.totalItems}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(po.totalValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              po.confidence >= 90 ? 'bg-success' :
                              po.confidence >= 70 ? 'bg-warning' : 'bg-destructive'
                            }`}
                            style={{ width: `${po.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{po.confidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedPO(po)
                          setShowDetails(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Order Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedPO?.poNumber} - {selectedPO?.supplier}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPO && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="items">Items ({selectedPO.totalItems})</TabsTrigger>
                <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{selectedPO.totalItems}</div>
                      <div className="text-xs text-muted-foreground">Total Items</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{formatCurrency(selectedPO.totalValue)}</div>
                      <div className="text-xs text-muted-foreground">Total Value</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{selectedPO.confidence}%</div>
                      <div className="text-xs text-muted-foreground">AI Confidence</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{formatFileSize(selectedPO.fileSize)}</div>
                      <div className="text-xs text-muted-foreground">File Size</div>
                    </CardContent>
                  </Card>
                </div>

                {/* File Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>File Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Filename</label>
                        <div className="text-sm text-muted-foreground">{selectedPO.fileName}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <div>{getStatusBadge(selectedPO.status)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Upload Date</label>
                        <div className="text-sm text-muted-foreground">{formatDate(selectedPO.uploadDate)}</div>
                      </div>
                      {selectedPO.processedDate && (
                        <div>
                          <label className="text-sm font-medium">Processed Date</label>
                          <div className="text-sm text-muted-foreground">{formatDate(selectedPO.processedDate)}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                      <TableHead className="text-right">Confidence</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(item.unitCost)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(item.totalCost)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${
                            item.confidence >= 90 ? 'text-success' :
                            item.confidence >= 70 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {item.confidence}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            item.status === 'matched' ? 'default' :
                            item.status === 'updated' ? 'secondary' :
                            item.status === 'new' ? 'outline' : 'destructive'
                          }>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="ai-analysis" className="space-y-4">
                {selectedPO.aiAnalysis && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Robot className="w-4 h-4 text-primary" />
                          <div>
                            <div className="text-2xl font-bold">{selectedPO.aiAnalysis.detectedFields}</div>
                            <div className="text-xs text-muted-foreground">Detected Fields</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <ChartLineUp className="w-4 h-4 text-success" />
                          <div>
                            <div className="text-2xl font-bold">{selectedPO.aiAnalysis.extractionAccuracy}%</div>
                            <div className="text-xs text-muted-foreground">Accuracy</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Lightning className="w-4 h-4 text-accent" />
                          <div>
                            <div className="text-2xl font-bold">{selectedPO.aiAnalysis.suggestedMappings}</div>
                            <div className="text-xs text-muted-foreground">Mappings</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Warning className="w-4 h-4 text-warning" />
                          <div>
                            <div className="text-2xl font-bold">{selectedPO.aiAnalysis.flaggedItems}</div>
                            <div className="text-xs text-muted-foreground">Flagged Items</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}