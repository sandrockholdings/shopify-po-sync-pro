import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar,
  Clock,
  Gear,
  Shield,
  Key,
  Globe,
  FileText,
  Robot,
  Warning,
  Check,
  Info,
  Eye,
  EyeSlash,
  Play,
  MapPin
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ScheduleConfig {
  // Basic Info
  supplierName: string
  description: string
  
  // Authentication
  authMethod: 'api_key' | 'oauth' | 'basic_auth' | 'custom'
  apiKey: string
  apiSecret: string
  username: string
  password: string
  authUrl: string
  
  // Connection Settings  
  baseUrl: string
  endpoints: {
    orders: string
    products: string
    inventory: string
  }
  
  // Schedule Settings
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  time: string
  timezone: string
  enabled: boolean
  
  // AI Configuration
  aiModel: 'gpt-4o' | 'gpt-4o-mini'
  confidenceThreshold: number
  autoApprove: boolean
  parseInstructions: string
  
  // Data Mapping
  fieldMappings: {
    sku: string
    quantity: string
    price: string
    supplier_code: string
  }
  
  // Advanced Options
  retryAttempts: number
  timeout: number
  rateLimit: number
}

interface ScheduleConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (config: ScheduleConfig) => void
}

export function ScheduleConfigDialog({ open, onOpenChange, onSave }: ScheduleConfigDialogProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [showPassword, setShowPassword] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  
  const [config, setConfig] = useState<ScheduleConfig>({
    supplierName: '',
    description: '',
    authMethod: 'api_key',
    apiKey: '',
    apiSecret: '',
    username: '',
    password: '',
    authUrl: '',
    baseUrl: '',
    endpoints: {
      orders: '/api/orders',
      products: '/api/products', 
      inventory: '/api/inventory'
    },
    frequency: 'daily',
    time: '09:00',
    timezone: 'America/New_York',
    enabled: true,
    aiModel: 'gpt-4o-mini',
    confidenceThreshold: 85,
    autoApprove: false,
    parseInstructions: '',
    fieldMappings: {
      sku: 'product_id',
      quantity: 'quantity_available',
      price: 'unit_price',
      supplier_code: 'supplier_sku'
    },
    retryAttempts: 3,
    timeout: 30,
    rateLimit: 100
  })

  const testConnection = async () => {
    setTestingConnection(true)
    setConnectionStatus('testing')
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setConnectionStatus('success')
      toast.success('Connection test successful!')
    } catch (error) {
      setConnectionStatus('error')
      toast.error('Connection test failed. Please check your credentials.')
    } finally {
      setTestingConnection(false)
    }
  }

  const handleSave = () => {
    // Validate required fields
    if (!config.supplierName || !config.baseUrl) {
      toast.error('Please fill in all required fields')
      return
    }
    
    onSave(config)
    onOpenChange(false)
    toast.success('Schedule configuration saved successfully!')
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      case 'success':
        return <Check className="w-4 h-4 text-success" />
      case 'error':
        return <Warning className="w-4 h-4 text-destructive" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Add New Sync Schedule
          </DialogTitle>
          <DialogDescription>
            Configure automated AI-powered purchase order retrieval and inventory synchronization
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
            <TabsTrigger value="auth" className="text-xs">Authentication</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs">Schedule</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">AI Config</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Supplier Information
                </CardTitle>
                <CardDescription>
                  Basic details about your supplier connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-name">Supplier Name *</Label>
                    <Input
                      id="supplier-name"
                      placeholder="e.g., TechnoSupply Co."
                      value={config.supplierName}
                      onChange={(e) => setConfig({...config, supplierName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="base-url">Base API URL *</Label>
                    <Input
                      id="base-url"
                      placeholder="https://api.supplier.com"
                      value={config.baseUrl}
                      onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Optional description of this supplier integration..."
                    value={config.description}
                    onChange={(e) => setConfig({...config, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="orders-endpoint">Orders Endpoint</Label>
                    <Input
                      id="orders-endpoint"
                      placeholder="/api/orders"
                      value={config.endpoints.orders}
                      onChange={(e) => setConfig({
                        ...config, 
                        endpoints: {...config.endpoints, orders: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="products-endpoint">Products Endpoint</Label>
                    <Input
                      id="products-endpoint"
                      placeholder="/api/products"
                      value={config.endpoints.products}
                      onChange={(e) => setConfig({
                        ...config, 
                        endpoints: {...config.endpoints, products: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventory-endpoint">Inventory Endpoint</Label>
                    <Input
                      id="inventory-endpoint"
                      placeholder="/api/inventory"
                      value={config.endpoints.inventory}
                      onChange={(e) => setConfig({
                        ...config, 
                        endpoints: {...config.endpoints, inventory: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="auth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Authentication Method
                </CardTitle>
                <CardDescription>
                  Configure how to authenticate with your supplier's API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Authentication Type</Label>
                  <Select
                    value={config.authMethod}
                    onValueChange={(value: any) => setConfig({...config, authMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="oauth">OAuth 2.0</SelectItem>
                      <SelectItem value="basic_auth">Basic Authentication</SelectItem>
                      <SelectItem value="custom">Custom Headers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.authMethod === 'api_key' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key *</Label>
                      <div className="relative">
                        <Input
                          id="api-key"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your API key"
                          value={config.apiKey}
                          onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-secret">API Secret</Label>
                      <Input
                        id="api-secret"
                        type="password"
                        placeholder="Enter API secret (if required)"
                        value={config.apiSecret}
                        onChange={(e) => setConfig({...config, apiSecret: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {config.authMethod === 'basic_auth' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        value={config.username}
                        onChange={(e) => setConfig({...config, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={config.password}
                        onChange={(e) => setConfig({...config, password: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {config.authMethod === 'oauth' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="auth-url">Authorization URL *</Label>
                      <Input
                        id="auth-url"
                        placeholder="https://api.supplier.com/oauth/authorize"
                        value={config.authUrl}
                        onChange={(e) => setConfig({...config, authUrl: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="client-id">Client ID *</Label>
                        <Input
                          id="client-id"
                          placeholder="Your OAuth client ID"
                          value={config.apiKey}
                          onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-secret">Client Secret *</Label>
                        <Input
                          id="client-secret"
                          type="password"
                          placeholder="Your OAuth client secret"
                          value={config.apiSecret}
                          onChange={(e) => setConfig({...config, apiSecret: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={testConnection}
                      disabled={testingConnection}
                      className="flex items-center gap-2"
                    >
                      {getConnectionStatusIcon()}
                      Test Connection
                    </Button>
                    {connectionStatus === 'success' && (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Connected
                      </Badge>
                    )}
                    {connectionStatus === 'error' && (
                      <Badge variant="destructive">
                        Connection Failed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Configuration Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Sync Schedule
                </CardTitle>
                <CardDescription>
                  Configure when and how often to retrieve purchase orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={config.frequency}
                      onValueChange={(value: any) => setConfig({...config, frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={config.time}
                      onChange={(e) => setConfig({...config, time: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={config.timezone}
                      onValueChange={(value) => setConfig({...config, timezone: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={config.enabled}
                    onCheckedChange={(checked) => setConfig({...config, enabled: checked})}
                  />
                  <Label htmlFor="enabled">Enable schedule immediately after creation</Label>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Schedule Preview</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This schedule will run <strong>{config.frequency}</strong> at{' '}
                    <strong>{config.time}</strong> ({config.timezone.replace('_', ' ')})
                    {config.enabled ? ', starting immediately after creation' : ', but will remain disabled until manually enabled'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Configuration Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Robot className="w-4 h-4" />
                  AI Processing Settings
                </CardTitle>
                <CardDescription>
                  Configure how AI will parse and process purchase order data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">AI Model</Label>
                    <Select
                      value={config.aiModel}
                      onValueChange={(value: any) => setConfig({...config, aiModel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o (More accurate)</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confidence">Confidence Threshold: {config.confidenceThreshold}%</Label>
                    <div className="px-2">
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={config.confidenceThreshold}
                        onChange={(e) => setConfig({...config, confidenceThreshold: Number(e.target.value)})}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-approve"
                    checked={config.autoApprove}
                    onCheckedChange={(checked) => setConfig({...config, autoApprove: checked})}
                  />
                  <Label htmlFor="auto-approve">
                    Auto-approve high confidence updates (≥{config.confidenceThreshold}%)
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parse-instructions">Custom Parsing Instructions</Label>
                  <Textarea
                    id="parse-instructions"
                    placeholder="Optional: Provide specific instructions for how the AI should parse your supplier's data format..."
                    value={config.parseInstructions}
                    onChange={(e) => setConfig({...config, parseInstructions: e.target.value})}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: "Focus on the 'items' array in the JSON response. Map 'item_code' to SKU and 'qty_available' to quantity."
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Field Mappings</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="sku-mapping">SKU Field Name</Label>
                      <Input
                        id="sku-mapping"
                        placeholder="product_id"
                        value={config.fieldMappings.sku}
                        onChange={(e) => setConfig({
                          ...config,
                          fieldMappings: {...config.fieldMappings, sku: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="quantity-mapping">Quantity Field Name</Label>
                      <Input
                        id="quantity-mapping"
                        placeholder="quantity_available"
                        value={config.fieldMappings.quantity}
                        onChange={(e) => setConfig({
                          ...config,
                          fieldMappings: {...config.fieldMappings, quantity: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="price-mapping">Price Field Name</Label>
                      <Input
                        id="price-mapping"
                        placeholder="unit_price"
                        value={config.fieldMappings.price}
                        onChange={(e) => setConfig({
                          ...config,
                          fieldMappings: {...config.fieldMappings, price: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="supplier-code-mapping">Supplier Code Field</Label>
                      <Input
                        id="supplier-code-mapping"
                        placeholder="supplier_sku"
                        value={config.fieldMappings.supplier_code}
                        onChange={(e) => setConfig({
                          ...config,
                          fieldMappings: {...config.fieldMappings, supplier_code: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gear className="w-4 h-4" />
                  Advanced Configuration
                </CardTitle>
                <CardDescription>
                  Fine-tune connection and performance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="retry-attempts">Retry Attempts</Label>
                    <Input
                      id="retry-attempts"
                      type="number"
                      min="1"
                      max="10"
                      value={config.retryAttempts}
                      onChange={(e) => setConfig({...config, retryAttempts: Number(e.target.value)})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of retry attempts for failed requests
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      min="10"
                      max="300"
                      value={config.timeout}
                      onChange={(e) => setConfig({...config, timeout: Number(e.target.value)})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Request timeout duration
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">Rate Limit (req/min)</Label>
                    <Input
                      id="rate-limit"
                      type="number"
                      min="1"
                      max="1000"
                      value={config.rateLimit}
                      onChange={(e) => setConfig({...config, rateLimit: Number(e.target.value)})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum requests per minute
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Warning className="w-4 h-4 text-warning mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Security Notice</p>
                      <p className="text-xs text-muted-foreground">
                        All credentials are encrypted at rest and in transit. API keys and passwords are never logged or stored in plain text.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={testingConnection}
              className="flex items-center gap-2"
            >
              {getConnectionStatusIcon()}
              Test & Save
            </Button>
            <Button onClick={handleSave}>
              <Play className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}