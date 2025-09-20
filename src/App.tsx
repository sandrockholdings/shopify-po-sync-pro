import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Package
} from '@phosphor-icons/react'
import { DashboardOverview } from './components/DashboardOverview'
import { POUpload } from './components/POUpload'
import { SyncScheduler } from './components/SyncScheduler'
import { SettingsPanel } from './components/SettingsPanel'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="border-b border-border bg-card"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">PO Manager</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Inventory Automation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                System Online
              </Badge>
              <Button variant="outline" size="sm">
                <Gear className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload PO
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Scheduler
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Gear className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <POUpload />
          </TabsContent>

          <TabsContent value="scheduler" className="space-y-6">
            <SyncScheduler />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App