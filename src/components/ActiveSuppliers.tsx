import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Globe, 
  Lightning,
  TrendUp,
  TrendDown,
  Minus,
  MagnifyingGlass as Search,
  Plus,
  Gear as Settings,
  Eye,
  Pencil as Edit,
  Trash as Trash2,
  Clock,
  Calendar,
  Gauge,
  ShieldCheck,
  Warning,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  Upload,
  Funnel as Filter,
  DotsThreeVertical as MoreVertical,
  Link,
  Key,
  Bell,
  Activity,
  Lightning as Zap,
  Database as Server,
  WifiHigh as Wifi,
  WifiSlash as WifiOff,
  WarningCircle as AlertTriangle,
  ArrowsClockwise as RefreshCw
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { safeFormatDate, safeFormatTime } from '@/lib/utils'

interface Supplier {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'online' | 'offline' | 'syncing' | 'error'
  accuracy: number
  avgProcessingTime: number
  totalPOs: number
  trend: 'up' | 'down' | 'stable'
  lastSync: string
  nextSync: string
  apiEndpoint: string
  apiKey: string
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  priority: 'high' | 'medium' | 'low'
  country: string
  timezone: string
  categories: string[]
  notes: string
  createdAt: string
  lastActivity: string
  totalValue: number
  avgOrderValue: number
  reliability: number
}

interface ActiveSuppliersProps {
  onBack: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export function ActiveSuppliers({ onBack }: ActiveSuppliersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  const [suppliers, setSuppliers] = useKV<Supplier[]>('suppliers', [
    {
      id: '1',
      name: 'TechnoSupply Co.',
      company: 'TechnoSupply Corporation',
      email: 'orders@technosupply.com',
      phone: '+1 (555) 123-4567',
      status: 'online',
      accuracy: 96,
      avgProcessingTime: 2.3,
      totalPOs: 156,
      trend: 'up',
      lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      nextSync: new Date(Date.now() + 55 * 60 * 1000).toISOString(),
      apiEndpoint: 'https://api.technosupply.com/v2/orders',
      apiKey: 'ts_***************4567',
      syncFrequency: 'hourly',
      priority: 'high',
      country: 'USA',
      timezone: 'EST',
      categories: ['Electronics', 'Components', 'Accessories'],
      notes: 'Primary supplier for electronic components. Excellent reliability and fast processing.',
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      totalValue: 1245000,
      avgOrderValue: 7980,
      reliability: 98
    },
    {
      id: '2',
      name: 'Global Parts Ltd.',
      company: 'Global Parts Limited',
      email: 'procurement@globalparts.co.uk',
      phone: '+44 20 1234 5678',
      status: 'syncing',
      accuracy: 89,
      avgProcessingTime: 3.1,
      totalPOs: 98,
      trend: 'stable',
      lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      nextSync: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      apiEndpoint: 'https://globalparts.co.uk/api/orders',
      apiKey: 'gp_***************8901',
      syncFrequency: 'hourly',
      priority: 'high',
      country: 'UK',
      timezone: 'GMT',
      categories: ['Auto Parts', 'Industrial'],
      notes: 'Reliable UK supplier with good processing times. Occasional API timeouts during peak hours.',
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      totalValue: 892000,
      avgOrderValue: 9100,
      reliability: 94
    },
    {
      id: '3',
      name: 'Premier Wholesale',
      company: 'Premier Wholesale Distribution',
      email: 'orders@premierwd.com',
      phone: '+1 (555) 987-6543',
      status: 'offline',
      accuracy: 78,
      avgProcessingTime: 4.2,
      totalPOs: 67,
      trend: 'down',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      nextSync: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      apiEndpoint: 'https://api.premierwd.com/orders',
      apiKey: 'pw_***************2345',
      syncFrequency: 'daily',
      priority: 'medium',
      country: 'USA',
      timezone: 'PST',
      categories: ['General Merchandise', 'Office Supplies'],
      notes: 'Currently experiencing connection issues. API endpoint returning 503 errors.',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      totalValue: 345000,
      avgOrderValue: 5150,
      reliability: 85
    },
    {
      id: '4',
      name: 'Alpha Electronics',
      company: 'Alpha Electronics Inc.',
      email: 'api@alphaelec.com',
      phone: '+1 (555) 456-7890',
      status: 'error',
      accuracy: 92,
      avgProcessingTime: 2.8,
      totalPOs: 134,
      trend: 'up',
      lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      nextSync: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      apiEndpoint: 'https://api.alphaelec.com/v1/pos',
      apiKey: 'ae_***************6789',
      syncFrequency: 'hourly',
      priority: 'high',
      country: 'USA',
      timezone: 'CST',
      categories: ['Electronics', 'Semiconductors'],
      notes: 'Authentication error detected. API key may have expired.',
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      totalValue: 1890000,
      avgOrderValue: 14100,
      reliability: 96
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-success" />
      case 'offline':
        return <WifiOff className="w-4 h-4 text-muted-foreground" />
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-warning animate-spin" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return <Server className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <div className="w-2 h-2 rounded-full bg-success mr-1" />
            Online
          </Badge>
        )
      case 'syncing':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse mr-1" />
            Syncing
          </Badge>
        )
      case 'offline':
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-muted-foreground mr-1" />
            Offline
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive">
            <div className="w-2 h-2 rounded-full bg-destructive-foreground mr-1" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendUp className="w-4 h-4 text-success" />
      case 'down':
        return <TrendDown className="w-4 h-4 text-destructive" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive border-destructive/20 bg-destructive/10'
      case 'medium':
        return 'text-warning border-warning/20 bg-warning/10'
      case 'low':
        return 'text-muted-foreground border-muted bg-muted/50'
      default:
        return 'text-muted-foreground border-muted bg-muted/50'
    }
  }

  const filteredSuppliers = (suppliers || [])
    .filter(supplier => 
      (filterStatus === 'all' || supplier.status === filterStatus) &&
      (searchTerm === '' || 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'accuracy':
          return b.accuracy - a.accuracy
        case 'lastSync':
          return new Date(b.lastSync).getTime() - new Date(a.lastSync).getTime()
        case 'totalPOs':
          return b.totalPOs - a.totalPOs
        default:
          return 0
      }
    })

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Active Suppliers</h1>
            <p className="text-muted-foreground">
              Manage and monitor your supplier connections and performance
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>
                  Configure a new supplier connection and sync settings
                </DialogDescription>
              </DialogHeader>
              <SupplierConfigForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {(suppliers || []).filter(s => s.status === 'online').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Online</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Activity className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {(suppliers || []).filter(s => s.status === 'syncing').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Syncing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {(suppliers || []).filter(s => ['offline', 'error'].includes(s.status)).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Issues</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Gauge className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round((suppliers || []).reduce((acc, s) => acc + s.accuracy, 0) / (suppliers || []).length) || 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search suppliers by name, company, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="syncing">Syncing</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="accuracy">Accuracy</SelectItem>
                  <SelectItem value="lastSync">Last Sync</SelectItem>
                  <SelectItem value="totalPOs">Total POs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredSuppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedSupplier(supplier)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                      supplier.status === 'online' ? 'from-success/20 to-success/10' :
                      supplier.status === 'syncing' ? 'from-warning/20 to-warning/10' :
                      supplier.status === 'error' ? 'from-destructive/20 to-destructive/10' :
                      'from-muted to-muted/50'
                    }`}>
                      {getStatusIcon(supplier.status)}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">{supplier.company}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(supplier.status)}
                        <Badge className={getPriorityColor(supplier.priority)} variant="outline">
                          {supplier.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Configure {supplier.name}</DialogTitle>
                        <DialogDescription>
                          Manage supplier settings, API configuration, and sync preferences
                        </DialogDescription>
                      </DialogHeader>
                      <SupplierConfigForm supplier={supplier} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{supplier.accuracy}%</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      Accuracy
                      {getTrendIcon(supplier.trend)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{supplier.totalPOs}</div>
                    <div className="text-xs text-muted-foreground">Total POs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{supplier.avgProcessingTime}s</div>
                    <div className="text-xs text-muted-foreground">Avg Time</div>
                  </div>
                </div>

                <Separator />

                {/* Categories & Info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {supplier.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last sync: {safeFormatTime(supplier.lastSync)} • 
                    Next sync: {safeFormatTime(supplier.nextSync)}
                  </div>
                </div>

                {/* Progress Bar for Reliability */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Reliability</span>
                    <span>{supplier.reliability}%</span>
                  </div>
                  <Progress value={supplier.reliability} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Supplier Detail Modal */}
      <Dialog open={!!selectedSupplier} onOpenChange={() => setSelectedSupplier(null)}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          {selectedSupplier && (
            <SupplierDetailView supplier={selectedSupplier} />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// Supplier Detail View Component
function SupplierDetailView({ supplier }: { supplier: Supplier }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <div className="w-2 h-2 rounded-full bg-success mr-1" />
            Online
          </Badge>
        )
      case 'syncing':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse mr-1" />
            Syncing
          </Badge>
        )
      case 'offline':
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-muted-foreground mr-1" />
            Offline
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive">
            <div className="w-2 h-2 rounded-full bg-destructive-foreground mr-1" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendUp className="w-4 h-4 text-success" />
      case 'down':
        return <TrendDown className="w-4 h-4 text-destructive" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }
  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-2xl">{supplier.name}</DialogTitle>
            <DialogDescription className="mt-1">
              {supplier.company} • {supplier.country} • {supplier.timezone}
            </DialogDescription>
          </div>
          {getStatusBadge(supplier.status)}
        </div>
      </DialogHeader>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="text-sm text-muted-foreground">{supplier.email}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <div className="text-sm text-muted-foreground">{supplier.phone}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Categories</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {supplier.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Value</span>
                  <span className="font-medium">${supplier.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Order Value</span>
                  <span className="font-medium">${supplier.avgOrderValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Orders</span>
                  <span className="font-medium">{supplier.totalPOs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Member Since</span>
                  <span className="font-medium">{safeFormatDate(supplier.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {supplier.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{supplier.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <div className="grid gap-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold">{supplier.accuracy}%</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    AI Accuracy
                    {getTrendIcon(supplier.trend)}
                  </div>
                  <Progress value={supplier.accuracy} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold">{supplier.avgProcessingTime}s</div>
                  <div className="text-sm text-muted-foreground">Avg Processing</div>
                  <div className="text-xs text-muted-foreground mt-2">Industry: 4.2s</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold">{supplier.reliability}%</div>
                  <div className="text-sm text-muted-foreground">Reliability</div>
                  <Progress value={supplier.reliability} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="mt-4">
          <SupplierConfigForm supplier={supplier} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync History</CardTitle>
              <CardDescription>Recent synchronization activities and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Sync history would be displayed here with detailed logs and timestamps.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

// Supplier Configuration Form Component
function SupplierConfigForm({ supplier }: { supplier?: Supplier }) {
  return (
    <Tabs defaultValue="basic" className="mt-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="api">API Settings</TabsTrigger>
        <TabsTrigger value="sync">Sync Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Supplier Name</Label>
            <Input id="name" defaultValue={supplier?.name || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" defaultValue={supplier?.company || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={supplier?.email || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" defaultValue={supplier?.phone || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" defaultValue={supplier?.country || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" defaultValue={supplier?.timezone || ''} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" defaultValue={supplier?.notes || ''} />
        </div>
      </TabsContent>

      <TabsContent value="api" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Input id="apiEndpoint" defaultValue={supplier?.apiEndpoint || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input id="apiKey" type="password" defaultValue={supplier?.apiKey || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select defaultValue={supplier?.priority || 'medium'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="sync" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="syncFrequency">Sync Frequency</Label>
            <Select defaultValue={supplier?.syncFrequency || 'hourly'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Every Hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications">Enable sync notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="autoRetry" />
            <Label htmlFor="autoRetry">Auto-retry failed syncs</Label>
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <Button variant="outline">Cancel</Button>
        <Button>Save Configuration</Button>
      </div>
    </Tabs>
  )
}