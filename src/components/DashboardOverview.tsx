import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Check, 
  Warning,
  Clock,
  Users,
  ArrowRight,
  TrendUp,
  TrendDown,
  Minus,
  Robot,
  Lightning,
  Globe,
  Database,
  Eye,
  Download,
  Funnel,
  Calendar,
  Gauge,
  ShieldCheck,
  WarningCircle
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface POSummary {
  id: string
  supplier: string
  status: 'processed' | 'pending' | 'error'
  confidence: number
  itemCount: number
  timestamp: string | Date
  value: number
  priority: 'low' | 'medium' | 'high'
}

interface SupplierMetrics {
  name: string
  accuracy: number
  avgProcessingTime: number
  totalPOs: number
  trend: 'up' | 'down' | 'stable'
  lastSync: string | Date
  status: 'online' | 'offline' | 'syncing'
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

export function DashboardOverview() {
  const [recentPOs] = useKV<POSummary[]>('recent-pos', [
    {
      id: 'PO-2024-001',
      supplier: 'TechnoSupply Co.',
      status: 'processed',
      confidence: 95,
      itemCount: 24,
      value: 15420,
      priority: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'PO-2024-002', 
      supplier: 'Global Parts Ltd.',
      status: 'processed',
      confidence: 87,
      itemCount: 12,
      value: 8750,
      priority: 'medium',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'PO-2024-003',
      supplier: 'Premier Wholesale',
      status: 'pending',
      confidence: 0,
      itemCount: 8,
      value: 5200,
      priority: 'low',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: 'PO-2024-004',
      supplier: 'Alpha Electronics',
      status: 'error',
      confidence: 45,
      itemCount: 18,
      value: 12300,
      priority: 'high',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ])

  const [supplierMetrics] = useKV<SupplierMetrics[]>('supplier-metrics', [
    {
      name: 'TechnoSupply Co.',
      accuracy: 96,
      avgProcessingTime: 2.3,
      totalPOs: 156,
      trend: 'up',
      lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'online'
    },
    {
      name: 'Global Parts Ltd.',
      accuracy: 89,
      avgProcessingTime: 3.1,
      totalPOs: 98,
      trend: 'stable',
      lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'syncing'
    },
    {
      name: 'Premier Wholesale',
      accuracy: 78,
      avgProcessingTime: 4.2,
      totalPOs: 67,
      trend: 'down',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'offline'
    }
  ])

  const getStatusBadge = (status: string, confidence: number) => {
    switch (status) {
      case 'processed':
        return (
          <Badge variant={confidence > 90 ? 'default' : 'secondary'} className="gap-1 font-medium">
            <Check className="w-3 h-3" />
            Processed ({confidence}%)
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="gap-1 border-warning/50 text-warning bg-warning/10">
            <Clock className="w-3 h-3" />
            Processing
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive" className="gap-1">
            <Warning className="w-3 h-3" />
            Needs Review
          </Badge>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-destructive text-destructive-foreground">High</Badge>
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
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

  const getSupplierStatusBadge = (status: string) => {
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
      default:
        return null
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Enhanced Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total POs Today</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <TrendUp className="w-3 h-3 text-success" />
                +12% from yesterday
              </div>
              <Progress value={75} className="h-1 mt-3" />
              <div className="text-xs text-muted-foreground mt-1">Target: 32 POs</div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10" />
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
              <div className="p-2 rounded-lg bg-success/10">
                <Robot className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">94.2%</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <TrendUp className="w-3 h-3 text-success" />
                +2.1% this week
              </div>
              <Progress value={94.2} className="h-1 mt-3" />
              <div className="text-xs text-muted-foreground mt-1">Industry avg: 89%</div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-success/5 rounded-full -mr-10 -mt-10" />
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <div className="p-2 rounded-lg bg-accent/10">
                <Globe className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Lightning className="w-3 h-3 text-warning" />
                3 syncing now
              </div>
              <div className="flex gap-1 mt-3">
                {[1,2,3,4,5,6,7,8].map((i) => (
                  <div key={i} className={`w-4 h-1 rounded-full ${i <= 6 ? 'bg-success' : i === 7 ? 'bg-warning' : 'bg-muted'}`} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">6 online, 1 syncing, 1 offline</div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -mr-10 -mt-10" />
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted border-muted">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Updated</CardTitle>
              <div className="p-2 rounded-lg bg-muted">
                <Database className="h-4 w-4 text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,247</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Clock className="w-3 h-3" />
                In the last hour
              </div>
              <Progress value={82} className="h-1 mt-3" />
              <div className="text-xs text-muted-foreground mt-1">Processing rate: 21/min</div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-muted/20 rounded-full -mr-10 -mt-10" />
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Recent PO Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Recent Purchase Orders</CardTitle>
                  <CardDescription className="mt-1">
                    Latest PO processing results with AI confidence scores and priority levels
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Funnel className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(recentPOs || []).map((po, index) => (
                  <motion.div
                    key={po.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 hover:border-muted-foreground/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          po.status === 'processed' 
                            ? 'bg-success/10 border border-success/20' 
                            : po.status === 'error'
                            ? 'bg-destructive/10 border border-destructive/20'
                            : 'bg-warning/10 border border-warning/20'
                        }`}>
                          <FileText className={`w-5 h-5 ${
                            po.status === 'processed' ? 'text-success' :
                            po.status === 'error' ? 'text-destructive' : 'text-warning'
                          }`} />
                        </div>
                        {po.priority === 'high' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive border-2 border-card" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="font-semibold">{po.id}</div>
                          {getPriorityBadge(po.priority)}
                        </div>
                        <div className="text-sm text-muted-foreground">{po.supplier}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ${po.value.toLocaleString()} • {po.itemCount} items
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {po.timestamp ? new Date(po.timestamp).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {po.timestamp ? new Date(po.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : 'N/A'}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(po.status, po.confidence)}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Supplier Performance */}
        <motion.div variants={cardVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">Supplier Performance</CardTitle>
              <CardDescription>
                Real-time accuracy and processing metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {supplierMetrics?.map((supplier, index) => (
                  <motion.div
                    key={supplier.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{supplier.name}</div>
                      {getSupplierStatusBadge(supplier.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Gauge className="w-3 h-3" />
                          Accuracy
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          {supplier.accuracy}%
                          {getTrendIcon(supplier.trend)}
                        </span>
                      </div>
                      <Progress value={supplier.accuracy} className="h-1.5" />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{supplier.totalPOs} POs</span>
                      <span>{supplier.avgProcessingTime}s avg</span>
                    </div>

                    {index < supplierMetrics.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced System Health */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">System Health & Performance</CardTitle>
                <CardDescription className="mt-1">
                  Real-time monitoring of AI processing engine and supplier connections
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Robot className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="font-semibold">AI Processing Engine</div>
                    <div className="text-sm text-muted-foreground">Core ML Pipeline</div>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success border-success/20 w-full justify-center py-2">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Fully Operational
                </Badge>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-medium">99.8%</span>
                  </div>
                  <Progress value={99.8} className="h-2" />
                  <div className="text-xs text-muted-foreground">30 days: 99.8%</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Globe className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <div className="font-semibold">Supplier Connections</div>
                    <div className="text-sm text-muted-foreground">API Integrations</div>
                  </div>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning/20 w-full justify-center py-2">
                  <WarningCircle className="w-4 h-4 mr-2" />
                  Minor Issues Detected
                </Badge>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Connected</span>
                    <span className="font-medium">7 of 8</span>
                  </div>
                  <Progress value={87.5} className="h-2" />
                  <div className="text-xs text-muted-foreground">Premier Wholesale offline</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Data Processing</div>
                    <div className="text-sm text-muted-foreground">Queue & Storage</div>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success border-success/20 w-full justify-center py-2">
                  <Check className="w-4 h-4 mr-2" />
                  All Systems Normal
                </Badge>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Queue</span>
                    <span className="font-medium">3 pending</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  <div className="text-xs text-muted-foreground">Avg wait: 1.2 minutes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}