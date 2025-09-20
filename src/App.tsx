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
import { BulkPOConfiguration } from './components/BulkPOConfiguration'
import { QuickSync } from './components/QuickSync'
import { NotificationsPanel } from './components/NotificationsPanel'
import { ActiveSuppliers } from './components/ActiveSuppliers'
import { AllPurchaseOrders } from './components/AllPurchaseOrders'
import { PurchaseOrderDetails } from './components/PurchaseOrderDetails'
import { AIChatbot } from './components/AIChatbot'
import { useKV } from '@github/spark/hooks'
import { safeFormatTime } from '@/lib/utils'
import { notificationService } from '@/lib/notificationService'

interface NotificationItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  timestamp: string // ISO string timestamp
  read: boolean
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showQuickSync, setShowQuickSync] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showActiveSuppliers, setShowActiveSuppliers] = useState(false)
  const [showAllPurchaseOrders, setShowAllPurchaseOrders] = useState(false)
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState<string | null>(null)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showAIChatbot, setShowAIChatbot] = useState(false)
  const [isAIChatbotMinimized, setIsAIChatbotMinimized] = useState(false)
  const [notifications] = useKV<NotificationItem[]>('notifications', [
    {
      id: '1',
      type: 'success',
      title: 'PO Processed Successfully',
      message: 'TechnoSupply Co. PO-2024-001 processed with 95% confidence',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Confidence Detection',
      message: 'Premier Wholesale PO requires manual review',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Sync Scheduled',
      message: 'Next supplier sync in 2 hours',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: true
    }
  ])

  // Initialize notification service with settings
  const [notificationSettings] = useKV<any>('notification-settings', {
    enabled: true,
    desktopEnabled: false,
    soundEnabled: true,
    soundVolume: 70,
    successSound: 'chime',
    warningSound: 'bell',
    errorSound: 'alert',
    infoSound: 'soft',
    types: {
      success: true,
      warning: true,
      error: true,
      info: true
    },
    doNotDisturbEnabled: false,
    doNotDisturbStart: '22:00',
    doNotDisturbEnd: '08:00',
    autoDismissEnabled: true,
    autoDismissDelay: 5000
  })

  // Update notification service when settings change
  useEffect(() => {
    if (notificationSettings) {
      notificationService.updateSettings(notificationSettings)
    }
  }, [notificationSettings])

  // Demo: Add some notifications after app loads
  useEffect(() => {
    const timer = setTimeout(() => {
      // Demo notifications to showcase the system
      notificationService.showInfo(
        'Welcome to PO Manager Pro',
        'Your AI-powered inventory management system is ready. Configure your notification preferences in Settings.',
        { category: 'system', priority: 'low' }
      )
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // This will be managed by the NotificationsPanel component

  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  useEffect(() => {
    // Set initial time safely
    setCurrentTime(new Date())
    
    const timer = setInterval(() => {
      try {
        setCurrentTime(new Date())
      } catch {
        // If Date constructor fails for some reason, keep previous time
      }
    }, 1000)
    
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
                  {safeFormatTime(currentTime)}
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
              <Button 
                variant="outline" 
                size="sm" 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
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
          {!showActiveSuppliers && !showAllPurchaseOrders && !selectedPurchaseOrderId && (
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
                <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" onClick={() => {
                  setShowQuickSync(true)
                  // Demo notification
                  setTimeout(() => {
                    notificationService.showSuccess(
                      'Quick Sync Initiated', 
                      'Syncing 3 suppliers with latest purchase orders',
                      { category: 'sync', priority: 'medium' }
                    )
                  }, 1000)
                }}>
                  <Lightning className="w-4 h-4 mr-2" />
                  Quick Sync
                </Button>
              </div>
            </div>
          )}

          {/* Enhanced Tab Content with Transitions */}
          <AnimatePresence mode="wait">
            {!showActiveSuppliers && !showAllPurchaseOrders && !selectedPurchaseOrderId ? (
              <>
                <TabsContent value="dashboard" className="space-y-6 mt-6">
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DashboardOverview 
                      onShowActiveSuppliers={() => setShowActiveSuppliers(true)} 
                      onShowAllPurchaseOrders={() => setShowAllPurchaseOrders(true)}
                      onShowPurchaseOrderDetails={(orderId) => setSelectedPurchaseOrderId(orderId)}
                    />
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
              </>
            ) : showActiveSuppliers ? (
              <motion.div
                key="active-suppliers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <ActiveSuppliers onBack={() => setShowActiveSuppliers(false)} />
              </motion.div>
            ) : showAllPurchaseOrders ? (
              <motion.div
                key="all-purchase-orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <AllPurchaseOrders onBack={() => setShowAllPurchaseOrders(false)} />
              </motion.div>
            ) : selectedPurchaseOrderId ? (
              <motion.div
                key="purchase-order-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <PurchaseOrderDetails 
                  orderId={selectedPurchaseOrderId}
                  onBack={() => setSelectedPurchaseOrderId(null)}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNotificationUpdate={setUnreadNotifications}
        onOpenSettings={() => {
          setActiveTab('settings')
          // In the future, could also set a specific tab within settings
        }}
      />

      {/* Quick Sync Modal */}
      <AnimatePresence>
        {showQuickSync && (
          <QuickSync onClose={() => setShowQuickSync(false)} />
        )}
      </AnimatePresence>

      {/* AI Chatbot */}
      <AIChatbot
        isOpen={showAIChatbot}
        isMinimized={isAIChatbotMinimized}
        onToggle={() => setShowAIChatbot(!showAIChatbot)}
        onMinimize={() => setIsAIChatbotMinimized(true)}
        onClose={() => {
          setShowAIChatbot(false)
          setIsAIChatbotMinimized(false)
        }}
      />
    </div>
  )
}

export default App