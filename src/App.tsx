import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Upload, 
  Calendar, 
  Gear, 
  FileText, 
  Check, 
  Warning,
  TrendUp,
  Clock,
  Users,
  Package,
  Bell,
  MagnifyingGlass,
  ChartLine,
  Robot,
  Globe,
  ShoppingBag,
  ArrowRight,
  Lightning,
  Shield,
  Database,
  ArrowsClockwise
} from '@phosphor-icons/react'
import { DashboardOverview } from './components/DashboardOverview'
import { POUpload } from './components/POUpload'
import { SyncScheduler } from './components/SyncScheduler'
import { SettingsPanel } from './components/SettingsPanel'
import { useKV } from '@github/spark/hooks'

interface NotificationItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notifications] = useKV<NotificationItem[]>('notifications', [
    {
      id: '1',
      type: 'success',
      title: 'PO Processed Successfully',
      message: 'TechnoSupply Co. PO-2024-001 processed with 95% confidence',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Confidence Detection',
      message: 'Premier Wholesale PO requires manual review',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Sync Scheduled',
      message: 'Next supplier sync in 2 hours',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true
    }
  ])

  const unreadNotifications = notifications?.filter(n => !n.read).length || 0

  const [currentTime, setCurrentTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Advanced Header */}
      <motion.header 
        className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand & Status */}
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Package className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-card animate-pulse" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  PO Manager Pro
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Robot className="w-4 h-4" />
                    AI-Powered Automation
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="flex items-center gap-1">
                    <Lightning className="w-4 h-4" />
                    Real-time Processing
                  </span>
                </div>
              </div>
            </div>

            {/* Advanced Status & Controls */}
            <div className="flex items-center gap-4">
              {/* Live Clock */}
              <Card className="px-3 py-1.5 bg-muted/50">
                <div className="text-sm font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
              </Card>

              {/* System Status */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-2 bg-success/10 border-success/20 text-success">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  All Systems Operational
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <ArrowsClockwise className="w-3 h-3" />
                  8 Active Syncs
                </Badge>
              </div>

              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>

              {/* User Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  AD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Navigation */}
      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats Bar */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ChartLine className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">94.2%</div>
                  <div className="text-xs text-muted-foreground">AI Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-success/5 to-success/10 border-success/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <FileText className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-muted-foreground">POs Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-accent/5 to-warning/5 border-accent/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Suppliers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted border-muted">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Database className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">1.2K</div>
                  <div className="text-xs text-muted-foreground">Items Updated</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Enhanced Tab Navigation */}
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-4 lg:w-[700px] h-12 bg-muted/30 p-1">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 h-10 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border transition-all"
              >
                <TrendUp className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="upload" 
                className="flex items-center gap-2 h-10 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border transition-all"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">PO Upload</span>
                <span className="sm:hidden">Upload</span>
              </TabsTrigger>
              <TabsTrigger 
                value="scheduler" 
                className="flex items-center gap-2 h-10 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Auto Scheduler</span>
                <span className="sm:hidden">Scheduler</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 h-10 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border transition-all"
              >
                <Gear className="w-4 h-4" />
                <span className="hidden sm:inline">Configuration</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MagnifyingGlass className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Lightning className="w-4 h-4 mr-2" />
                Quick Sync
              </Button>
            </div>
          </div>

          {/* Enhanced Tab Content with Transitions */}
          <AnimatePresence mode="wait">
            <TabsContent value="dashboard" className="space-y-6 mt-6">
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardOverview />
              </motion.div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6 mt-6">
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <POUpload />
              </motion.div>
            </TabsContent>

            <TabsContent value="scheduler" className="space-y-6 mt-6">
              <motion.div
                key="scheduler"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SyncScheduler />
              </motion.div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsPanel />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

export default App