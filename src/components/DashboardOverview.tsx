import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Check, 
  Warning,
  Clock,
  Users,
  ArrowRight,
  TrendUp
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface POSummary {
  id: string
  supplier: string
  status: 'processed' | 'pending' | 'error'
  confidence: number
  itemCount: number
  timestamp: Date
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: 'PO-2024-002', 
      supplier: 'Global Parts Ltd.',
      status: 'processed',
      confidence: 87,
      itemCount: 12,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: 'PO-2024-003',
      supplier: 'Premier Wholesale',
      status: 'pending',
      confidence: 0,
      itemCount: 8,
      timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
    }
  ])

  const getStatusBadge = (status: string, confidence: number) => {
    switch (status) {
      case 'processed':
        return (
          <Badge variant={confidence > 90 ? 'default' : 'secondary'} className="gap-1">
            <Check className="w-3 h-3" />
            Processed ({confidence}%)
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="gap-1">
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total POs Today</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
              <TrendUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                3 syncing now
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Updated</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                In the last hour
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent PO Activity */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Purchase Orders</CardTitle>
                <CardDescription>
                  Latest PO processing results with AI confidence scores
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
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
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{po.id}</div>
                      <div className="text-sm text-muted-foreground">{po.supplier}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{po.itemCount} items</div>
                      <div className="text-xs text-muted-foreground">
                        {po.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                    {getStatusBadge(po.status, po.confidence)}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Health */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Real-time status of AI processing and supplier connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Processing Engine</span>
                <Badge className="bg-success text-success-foreground">
                  <div className="w-2 h-2 rounded-full bg-success-foreground/80 mr-2" />
                  Healthy
                </Badge>
              </div>
              <Progress value={98} className="h-2" />
              <p className="text-xs text-muted-foreground">98% uptime this month</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Supplier Connections</span>
                <Badge className="bg-warning text-warning-foreground">
                  <div className="w-2 h-2 rounded-full bg-warning-foreground/80 mr-2" />
                  Minor Issues
                </Badge>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">7 of 8 suppliers connected</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}