'use client'

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Smartphone, 
  Package, 
  Settings, 
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Camera,
  Wrench
} from "lucide-react"
import { DeviceType, RepairService } from '@/lib/types'

import { 
  getDeviceTypes, 
  getBrandsByType, 
  getModelsByBrand, 
  getPartsByDeviceModel 
} from '@/app/actions/device-catalog-actions'
import {
  getAllDevices,
  getAllParts,
  createDevice,
  createPart,
  updateDevice,
  updatePart,
  deleteDevice,
  deletePart,
  getRepairServices,
  createRepairService,
  updateRepairService,
  deleteRepairService,
  getAllBrands,
  getModelsByBrandDetailed
} from '@/app/actions/device-management-actions'
import { uploadImage } from '@/app/actions/image-upload-actions'
import { getRepairServicesForDevice } from '@/app/actions/device-catalog-actions'

interface DeviceCatalogModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Device {
  id: string
  type: DeviceType
  brand: string
  model: string
  order: number
  series?: string | null;
  imageUrl?: string;
  description?: string;
}

interface Part {
  id: string;
  name: string;
  sku: string;
  cost: number;
  supplier: string;
  inStock: number;
  minStock: number;
  imageUrl?: string;
  description?: string;
  deviceModel?: string | null;
  deviceType?: string | null;
  quality?: string | null;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export function DeviceCatalogModal({ isOpen, onClose }: DeviceCatalogModalProps) {
  const [activeTab, setActiveTab] = useState('devices')
  
  // Device management state
  const [devices, setDevices] = useState<Device[]>([])
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [parts, setParts] = useState<Part[]>([])
  
  // Service management state
  const [services, setServices] = useState<RepairService[]>([])
  const [editingService, setEditingService] = useState<RepairService | null>(null)
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    basePrice: 0,
    estimatedTime: 60,
    deviceTypes: [] as DeviceType[],
    specificBrand: null as string | null,
    specificModel: null as string | null,
    priceVariations: null as Record<string, number> | null,
    popularity: null as "Most Popular" | "Popular" | null,
    icon: ''
  })
  
  // Form states
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [editingPart, setEditingPart] = useState<Part | null>(null)
  const [newDevice, setNewDevice] = useState({
    type: '' as DeviceType | '',
    brand: '',
    model: '',
    order: 0,
    series: '',
    imageUrl: '',
    description: ''
  })
  const [newPart, setNewPart] = useState({
    name: '',
    sku: '',
    cost: 0,
    inStock: 0,
    minStock: 1,
    supplier: '',
    deviceModel: '',
    deviceType: '',
    imageUrl: '',
    description: '',
    quality: '',
    order: 0
  })

  // Image upload states
  const [uploadingDeviceImage, setUploadingDeviceImage] = useState(false)
  const [uploadingPartImage, setUploadingPartImage] = useState(false)

  // Service management states
  const [selectedServiceDeviceType, setSelectedServiceDeviceType] = useState<DeviceType | null>(null)
  const [showAddServiceDialog, setShowAddServiceDialog] = useState(false)

  // All available models
  const [allDevices, setAllDevices] = useState<Device[]>([])
  const [allModels, setAllModels] = useState<string[]>([])

  // Add error state for part creation
  const [partError, setPartError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      loadDeviceTypes()
      loadDevices()
      loadParts()
      loadServices()
      loadAvailableBrands()
      fetchAllModels()
    }
  }, [isOpen])

  // Load models when editing a service that has a brand selected
  useEffect(() => {
    if (editingService?.specificBrand) {
      loadModelsForBrand(editingService.specificBrand)
    }
  }, [editingService])

  useEffect(() => {
    async function fetchDevices() {
      try {
        const devices = await getAllDevices()
        setAllDevices(devices) // Store full device objects
        setAllModels(Array.from(new Set(devices.map((d: any) => d.model).filter(Boolean))))
      } catch (error) {
        setAllDevices([])
        setAllModels([])
      }
    }
    if (isOpen) fetchDevices()
  }, [isOpen])

  const loadDeviceTypes = async () => {
    try {
      const types = await getDeviceTypes()
      setDeviceTypes(types as DeviceType[])
    } catch (error) {
      console.error('Error loading device types:', error)
    }
  }
  // --- PARTS FILTER STATE ---
  const [filterDeviceType, setFilterDeviceType] = useState<string>('');
  const [filterBrand, setFilterBrand] = useState<string>('');
  const [filterModel, setFilterModel] = useState<string>('');

  // Memoized unique device types, brands, and models from parts
  const partDeviceTypes = Array.from(new Set(parts.map((p: Part) => p.deviceType).filter(Boolean) as string[])).sort();
  // Brand extraction: prefer explicit brand field, fallback to deviceModel/description regex
  const partBrands = Array.from(new Set(parts.map((p: Part) => {
    // Prefer explicit brand if present
    if ((p as any).brand && typeof (p as any).brand === 'string' && (p as any).brand.trim() !== '') {
      return (p as any).brand.trim();
    }
    // Fallback: extract from deviceModel
    if (p.deviceModel) {
      const match = p.deviceModel.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
      if (match) return match[1];
    }
    // Fallback: extract from description
    if (p.description) {
      const match = p.description.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
      if (match) return match[1];
    }
    return null;
  }).filter(Boolean) as string[])).sort();
  const partModels = Array.from(new Set(parts.filter((p: Part) => {
    let matchesBrand = true;
    if (filterBrand) {
      if (p.deviceModel) {
        const match = p.deviceModel.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
        matchesBrand = !!(match && match[1] === filterBrand);
      } else {
        matchesBrand = false;
      }
    }
    return (!filterDeviceType || p.deviceType === filterDeviceType) && matchesBrand && p.deviceModel;
  }).map((p: Part) => p.deviceModel as string))).sort();

  // Filtered parts
  const filteredParts = parts.filter((p: Part) => {
    let matchesBrand = true;
    if (filterBrand) {
      if (p.deviceModel) {
        const match = p.deviceModel.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
        matchesBrand = !!(match && match[1] === filterBrand);
      } else if (p.description) {
        const match = p.description.match(/^(Apple|Samsung|Huawei|Xiaomi|OnePlus|Sony|Google|Nokia|Motorola|LG|HTC|Asus|Acer|Lenovo|Microsoft|Honor|Realme|Oppo|Vivo|Nothing|Fairphone|Alcatel|BlackBerry|Meizu|ZTE|TCL|Panasonic|Sharp|Philips|Amazon|Other)[\s-]/i);
        matchesBrand = !!(match && match[1] === filterBrand);
      } else {
        matchesBrand = false;
      }
    }
    return (
      (!filterDeviceType || p.deviceType === filterDeviceType) &&
      matchesBrand &&
      (!filterModel || p.deviceModel === filterModel)
    );
  });
  const loadDevices = async () => {
    try {
      const deviceData = await getAllDevices()
      setDevices(deviceData)
    } catch (error) {
      console.error('Error loading devices:', error)
    }
  }

  const loadParts = async () => {
    try {
      const partData = await getAllParts()
      setParts(partData)
    } catch (error) {
      console.error('Error loading parts:', error)
    }
  }

  const loadServices = async () => {
    try {
      const serviceData = await getRepairServices()
      setServices(serviceData)
    } catch (error) {
      console.error('Error loading services:', error)
    }
  }

  const loadAvailableBrands = async () => {
    try {
      const brandsData = await getAllBrands()
      setAvailableBrands(brandsData)
    } catch (error) {
      console.error('Error loading brands:', error)
    }
  }

  const loadModelsForBrand = async (brand: string) => {
    try {
      const modelsData = await getModelsByBrandDetailed(brand)
      setAvailableModels(modelsData.map(device => device.model))
    } catch (error) {
      console.error('Error loading models for brand:', error)
      setAvailableModels([])
    }
  }

  const fetchAllModels = async () => {
    try {
      const devices = await getAllDevices()
      // Extract unique models
      const uniqueModels = Array.from(new Set(devices.map((d: any) => d.model).filter(Boolean)))
      setAllModels(uniqueModels)
    } catch (error) {
      setAllModels([])
    }
  }

  const handleAddDevice = async () => {
    if (newDevice.type && newDevice.brand && newDevice.model) {
      try {
        // Generate order if not provided
        let order = newDevice.order && Number.isFinite(newDevice.order) && newDevice.order !== 0
          ? newDevice.order
          : Math.floor(Date.now() / 1000);
        const device = await createDevice({
          type: newDevice.type as DeviceType,
          brand: newDevice.brand,
          model: newDevice.model,
          order,
          series: newDevice.series || null,
          imageUrl: newDevice.imageUrl,
          description: newDevice.description
        })
        setDevices([...devices, device])
        setNewDevice({ type: '', brand: '', model: '', order: 0, series: '', imageUrl: '', description: '' })
      } catch (error) {
        console.error('Error adding device:', error)
      }
    }
  }

  const handleAddPart = async () => {
    setPartError(null);
    if (!newPart.name) {
      setPartError('Part name is required.');
      return;
    }
    if (!newPart.minStock || newPart.minStock < 1) {
      setPartError('Minimum stock must be at least 1.');
      return;
    }
    try {
      let deviceModelValue = newPart.deviceModel;
      if (deviceModelValue && deviceModelValue !== 'all') {
        const foundDevice = allDevices.find((d) => d.id === deviceModelValue);
        deviceModelValue = foundDevice ? foundDevice.model : deviceModelValue;
      } else if (deviceModelValue === 'all') {
        deviceModelValue = '';
      }
      // Generate SKU if not provided
      let sku = newPart.sku && newPart.sku.trim() !== ''
        ? newPart.sku.trim()
        : newPart.name
            .toUpperCase()
            .replace(/\s+/g, '-')
            .replace(/[^A-Z0-9-]/g, '')
            .replace(/-+/g, '-');
      // Generate order if not provided
      let order = newPart.order && Number.isFinite(newPart.order) && newPart.order !== 0
        ? newPart.order
        : Math.floor(Date.now() / 1000);
      const part = await createPart({
        ...newPart,
        sku,
        order,
        minStock: Math.max(1, newPart.minStock),
        deviceModel: deviceModelValue ? deviceModelValue : undefined,
        deviceType: newPart.deviceType ? newPart.deviceType : undefined,
        quality: newPart.quality || undefined,
      });
      setParts([
        ...parts,
        {
          ...part,
          quality: part.quality ?? null,
          createdAt: part.createdAt ?? new Date().toISOString(),
          updatedAt: part.updatedAt ?? new Date().toISOString(),
        },
      ]);
      setNewPart({
        name: '',
        sku: '',
        cost: 0,
        inStock: 0,
        minStock: 1,
        supplier: '',
        deviceModel: '',
        deviceType: '',
        imageUrl: '',
        description: '',
        quality: '',
        order: 0
      });
    } catch (error) {
      setPartError('Error adding part.');
      console.error('Error adding part:', error);
    }
  }

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      await deleteDevice(deviceId)
      setDevices(devices.filter(d => d.id !== deviceId))
    } catch (error) {
      console.error('Error deleting device:', error)
    }
  }

  const handleDeletePart = async (partId: string) => {
    try {
      await deletePart(partId)
      setParts(parts.filter(p => p.id !== partId))
    } catch (error) {
      console.error('Error deleting part:', error)
    }
  }

  // Service management handlers
  const handleAddService = async () => {
    if (newService.name && newService.basePrice > 0 && newService.deviceTypes.length > 0) {
      try {
        const service = await createRepairService({
          name: newService.name,
          description: newService.description,
          basePrice: newService.basePrice,
          estimatedTime: newService.estimatedTime,
          deviceTypes: newService.deviceTypes,
          specificBrand: newService.specificBrand,
          specificModel: newService.specificModel,
          priceVariations: newService.priceVariations,
          popularity: newService.popularity,
          icon: newService.icon
        })
        setServices([...services, service])
        setNewService({
          name: '',
          description: '',
          basePrice: 0,
          estimatedTime: 60,
          deviceTypes: [],
          specificBrand: null,
          specificModel: null,
          priceVariations: null,
          popularity: null,
          icon: ''
        })
      } catch (error) {
        console.error('Error adding service:', error)
      }
    }
  }

  const handleUpdateService = async () => {
    if (!editingService) return
    
    try {
      const updatedService = await updateRepairService(editingService.id, {
        name: editingService.name,
        description: editingService.description,
        basePrice: editingService.basePrice,
        estimatedTime: editingService.estimatedTime,
        deviceTypes: editingService.deviceTypes,
        specificBrand: editingService.specificBrand,
        specificModel: editingService.specificModel,
        priceVariations: editingService.priceVariations,
        popularity: editingService.popularity,
        icon: editingService.icon,
        isActive: editingService.isActive
      })
      setServices(services.map(s => s.id === editingService.id ? updatedService : s))
      setEditingService(null)
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteRepairService(serviceId)
      setServices(services.filter(s => s.id !== serviceId))
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  // Image upload handlers
  const handleDeviceImageUpload = async (file: File, isEditing: boolean = false) => {
    setUploadingDeviceImage(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'device')
      
      // Upload to server
      const imageUrl = await uploadImage(formData)
      
      if (isEditing && editingDevice) {
        setEditingDevice({ ...editingDevice, imageUrl })
      } else {
        setNewDevice({ ...newDevice, imageUrl })
      }
    } catch (error) {
      console.error('Error uploading device image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingDeviceImage(false)
    }
  }

  const handlePartImageUpload = async (file: File, isEditing: boolean = false) => {
    setUploadingPartImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'part')
      
      const imageUrl = await uploadImage(formData)
      
      if (isEditing && editingPart) {
        setEditingPart({ ...editingPart, imageUrl })
      } else {
        setNewPart({ ...newPart, imageUrl })
      }
    } catch (error) {
      console.error('Error uploading part image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingPartImage(false)
    }
  }

  // Update handlers
  const handleUpdateDevice = async () => {
    if (!editingDevice) return
    try {
      const updatedDevice = await updateDevice(editingDevice.id, {
        type: editingDevice.type,
        brand: editingDevice.brand,
        model: editingDevice.model,
        order: typeof editingDevice.order === 'number' ? editingDevice.order : 0,
        series: editingDevice.series || null,
        imageUrl: editingDevice.imageUrl,
        description: editingDevice.description
      })
      setDevices(devices.map(d => d.id === editingDevice.id ? updatedDevice : d))
      setEditingDevice(null)
    } catch (error) {
      console.error('Error updating device:', error)
    }
  }

  const handleUpdatePart = async () => {
    if (!editingPart) return;
    let deviceModelValue = editingPart.deviceModel;
    if (deviceModelValue && deviceModelValue !== 'all') {
      const found = allDevices.find((d) => d.id === deviceModelValue);
      deviceModelValue = found ? found.model : deviceModelValue;
    } else if (deviceModelValue === 'all') {
      deviceModelValue = undefined;
    }
    try {
      const updatedPart = await updatePart(editingPart.id, {
        name: editingPart.name,
        sku: editingPart.sku,
        cost: editingPart.cost,
        inStock: editingPart.inStock,
        minStock: editingPart.minStock,
        supplier: editingPart.supplier,
        order: typeof editingPart.order === 'number' ? editingPart.order : 0,
        deviceModel: deviceModelValue ? deviceModelValue : undefined,
        deviceType: editingPart.deviceType ? editingPart.deviceType : undefined,
        quality: editingPart.quality || undefined,
      });
      setParts(
        parts.map((p) =>
          p.id === editingPart.id
            ? {
                ...updatedPart,
                quality: updatedPart.quality ?? null,
                createdAt: updatedPart.createdAt ?? p.createdAt,
                updatedAt: updatedPart.updatedAt ?? new Date().toISOString(),
              }
            : p
        )
      );
      setEditingPart(null);
    } catch (error) {
      console.error('Error updating part:', error);
    }
  }

  // Helper function to get services for a device type
  const getServicesForDeviceType = (deviceType: DeviceType) => {
    return services.filter(service => 
      service.isActive && service.deviceTypes.includes(deviceType)
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Settings className="h-6 w-6 mr-3" />
            Device Catalog Management
          </DialogTitle>
          <DialogDescription className="text-base">
            Manage devices, models, parts, and inventory for your repair shop
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12 mb-8">
            <TabsTrigger value="devices" className="text-base">Devices</TabsTrigger>
            <TabsTrigger value="parts" className="text-base">Parts</TabsTrigger>
            <TabsTrigger value="services" className="text-base">Services</TabsTrigger>
            <TabsTrigger value="settings" className="text-base">Settings</TabsTrigger>
          </TabsList>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-lg">Add New Device</CardTitle>
                <CardDescription className="text-base">
                  Add a new device model to your catalog
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Device Type</Label>
                    <Select
                      value={newDevice.type}
                      onValueChange={(value) => setNewDevice({ ...newDevice, type: value as DeviceType })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SMARTPHONE">Smartphone</SelectItem>
                        <SelectItem value="TABLET">Tablet</SelectItem>
                        <SelectItem value="LAPTOP">Laptop</SelectItem>
                        <SelectItem value="SMARTWATCH">Smartwatch</SelectItem>
                        <SelectItem value="DESKTOP">Desktop</SelectItem>
                        <SelectItem value="GAMING_CONSOLE">Gaming Console</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Order</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newDevice.order}
                      onChange={e => setNewDevice({ ...newDevice, order: Number(e.target.value) })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Brand</Label>
                    <Input
                      placeholder="e.g., Apple, Samsung"
                      value={newDevice.brand}
                      onChange={(e) => setNewDevice({ ...newDevice, brand: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Model</Label>
                    <Input
                      placeholder="e.g., iPhone 15 Pro"
                      value={newDevice.model}
                      onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Series/Family</Label>
                    <Input
                      placeholder="e.g., iPhone 15, Galaxy S, A Series"
                      value={newDevice.series}
                      onChange={(e) => setNewDevice({ ...newDevice, series: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Device Image</Label>
                  <div className="flex items-start space-x-6">
                    {newDevice.imageUrl && (
                      <div className="w-20 h-20 border rounded-lg overflow-hidden">
                        <img 
                          src={newDevice.imageUrl} 
                          alt="Device preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <FileUpload
                        onUploadComplete={(fileUrl, key) => {
                          setNewDevice({ ...newDevice, imageUrl: fileUrl });
                        }}
                        onUploadError={(error) => {
                          console.error('Upload error:', error);
                          alert('Failed to upload image. Please try again.');
                        }}
                        accept="image/*"
                        maxSize={5}
                        multiple={false}
                        disabled={uploadingDeviceImage}
                        label="Drop device image here or click to browse"
                        description="Recommended: 300x300px, max 5MB"
                        className="h-32"
                      />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Description (Optional)</Label>
                  <Textarea
                    placeholder="Device description, specifications, or notes..."
                    value={newDevice.description}
                    onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button onClick={handleAddDevice} className="h-11 text-base">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Device
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-lg">Device Catalog ({devices.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {device.imageUrl ? (
                          <img 
                            src={device.imageUrl} 
                            alt={device.model}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <Smartphone className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{device.brand} {device.model}</span>
                            <Badge variant="secondary">{device.type}</Badge>
                          </div>
                          {device.description && (
                            <p className="text-sm text-gray-500 mt-1">{device.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingDevice(device)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteDevice(device.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parts Tab */}
          <TabsContent value="parts" className="space-y-6">
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-lg">Add New Part</CardTitle>
                <CardDescription className="text-base">
                  Add parts and manage inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Part Name</Label>
                    <Input
                      placeholder="e.g., iPhone 15 Pro Screen"
                      value={newPart.name}
                      onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium">SKU</Label>
                    <Input
                      placeholder="e.g., IP15P-SCR-001"
                      value={newPart.sku}
                      onChange={(e) => setNewPart({ ...newPart, sku: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cost ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newPart.cost}
                      onChange={(e) => setNewPart({ ...newPart, cost: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>In Stock</Label>
                    <Input
                      type="number"
                      value={newPart.inStock}
                      onChange={(e) => setNewPart({ ...newPart, inStock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Stock</Label>
                    <Input
                      type="number"
                      value={newPart.minStock}
                      min={1}
                      onChange={(e) => setNewPart({ ...newPart, minStock: Math.max(1, parseInt(e.target.value) || 1) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Input
                      placeholder="e.g., TechParts Co"
                      value={newPart.supplier}
                      onChange={(e) => setNewPart({ ...newPart, supplier: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={newPart.order || 0}
                      onChange={(e) => setNewPart({ ...newPart, order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                {/* Device Compatibility Section */}
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="text-base font-medium mb-4">Device Compatibility</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="text-base font-medium">Device Type</Label>
                        <Select
                          value={newPart.deviceType}
                          onValueChange={(value) => setNewPart({ ...newPart, deviceType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select device type (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Universal (All Types)</SelectItem>
                            <SelectItem value="SMARTPHONE">Smartphone</SelectItem>
                            <SelectItem value="TABLET">Tablet</SelectItem>
                            <SelectItem value="LAPTOP">Laptop</SelectItem>
                            <SelectItem value="SMARTWATCH">Smartwatch</SelectItem>
                            <SelectItem value="DESKTOP">Desktop</SelectItem>
                            <SelectItem value="GAMING_CONSOLE">Gaming Console</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500">
                          Leave blank for universal parts compatible with all device types
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-medium">Specific Device Model</Label>
                        <Select
                          value={newPart.deviceModel}
                          onValueChange={(value) => setNewPart({ ...newPart, deviceModel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select model (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Universal (All Models)</SelectItem>
                            {(newPart.deviceType && newPart.deviceType !== 'all'
                              ? allDevices.filter((d) => d.type === newPart.deviceType)
                              : allDevices
                            ).map((device) => (
                              <SelectItem key={device.id} value={device.id}>
                                {device.brand} {device.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500">
                          Specify exact model for precise compatibility matching
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part Image Upload */}
                <div className="mt-4 space-y-4">
                  <Label>Part Image</Label>
                  <div className="flex items-center space-x-4">
                    {newPart.imageUrl && (
                      <div className="w-20 h-20 border rounded-lg overflow-hidden">
                        <img 
                          src={newPart.imageUrl} 
                          alt="Part preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <FileUpload
                        onUploadComplete={(fileUrl, key) => {
                          setNewPart({ ...newPart, imageUrl: fileUrl });
                        }}
                        onUploadError={(error) => {
                          console.error('Upload error:', error);
                          alert('Failed to upload image. Please try again.');
                        }}
                        accept="image/*"
                        maxSize={5}
                        multiple={false}
                        disabled={uploadingPartImage}
                        label="Drop part image here or click to browse"
                        description="Recommended: 300x300px, max 5MB"
                        className="h-32"
                      />
                    </div>
                  </div>
                </div>

                {/* Part Description */}
                <div className="mt-4 space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="Part description, compatibility, installation notes..."
                    value={newPart.description}
                    onChange={(e) => setNewPart({ ...newPart, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Quality Selection */}
                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select
                    value={newPart.quality}
                    onValueChange={(value) => setNewPart({ ...newPart, quality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OEM">OEM</SelectItem>
                      <SelectItem value="Incell">Incell</SelectItem>
                      <SelectItem value="Original">Original</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Aftermarket">Aftermarket</SelectItem>
                      <SelectItem value="Refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Error message */}
                {partError && (
                  <div className="text-red-500 text-sm mb-2">{partError}</div>
                )}

                <Button onClick={handleAddPart} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Part
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parts Inventory ({filteredParts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Parts Filter UI */}
                <div className="flex flex-wrap gap-4 items-end mb-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Device Type</label>
                    <select
                      className="border rounded px-2 py-1 min-w-[120px]"
                      value={filterDeviceType}
                      onChange={e => {
                        setFilterDeviceType(e.target.value);
                        setFilterBrand('');
                        setFilterModel('');
                      }}
                    >
                      <option value="">All</option>
                      {partDeviceTypes.map((type: string) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Brand</label>
                    <select
                      className="border rounded px-2 py-1 min-w-[120px]"
                      value={filterBrand}
                      onChange={e => {
                        setFilterBrand(e.target.value);
                        setFilterModel('');
                      }}
                    >
                      <option value="">All</option>
                      {partBrands.map((brand: string) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Model</label>
                    <select
                      className="border rounded px-2 py-1 min-w-[120px]"
                      value={filterModel}
                      onChange={e => setFilterModel(e.target.value)}
                    >
                      <option value="">All</option>
                      {partModels.map((model: string) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  {(filterDeviceType || filterBrand || filterModel) && (
                    <button
                      type="button"
                      className="ml-2 px-2 py-1 border rounded text-xs bg-gray-100 hover:bg-gray-200"
                      onClick={() => {
                        setFilterDeviceType('');
                        setFilterBrand('');
                        setFilterModel('');
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {filteredParts.map((part: Part) => (
                    <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {part.imageUrl ? (
                          <img 
                            src={part.imageUrl} 
                            alt={part.name}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{part.name}</span>
                            <Badge variant={part.inStock <= part.minStock ? "destructive" : "secondary"}>
                              {part.inStock} in stock
                            </Badge>
                            {part.quality && (
                              <Badge variant="outline" className="text-xs">
                                {part.quality}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {part.sku} • ${part.cost} • {part.supplier}
                          </div>
                          {part.description && (
                            <p className="text-sm text-gray-500 mt-1">{part.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingPart(part)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeletePart(part.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-lg">Service Management</CardTitle>
                <CardDescription className="text-base">
                  Manage repair services and pricing for different device types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Service Section */}
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base">Add New Service</CardTitle>
                    <CardDescription>
                      Create a new repair service for one or more device types
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Service Name</Label>
                        <Input
                          placeholder="e.g., Screen Replacement"
                          value={newService.name}
                          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Base Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newService.basePrice || ''}
                          onChange={(e) => setNewService({ ...newService, basePrice: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated Time (minutes)</Label>
                        <Input
                          type="number"
                          placeholder="60"
                          value={newService.estimatedTime || ''}
                          onChange={(e) => setNewService({ ...newService, estimatedTime: parseInt(e.target.value) || 60 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Popularity (Optional)</Label>
                        <Select
                          value={newService.popularity || ''}
                          onValueChange={(value) => setNewService({ 
                            ...newService, 
                            popularity: value === '' ? null : value as "Most Popular" | "Popular"
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select popularity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="Popular">Popular</SelectItem>
                            <SelectItem value="Most Popular">Most Popular</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Service description..."
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Compatible Device Types</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {deviceTypes.map((deviceType) => (
                          <div key={deviceType} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`new-${deviceType}`}
                              checked={newService.deviceTypes.includes(deviceType)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewService({
                                    ...newService,
                                    deviceTypes: [...newService.deviceTypes, deviceType]
                                  })
                                } else {
                                  setNewService({
                                    ...newService,
                                    deviceTypes: newService.deviceTypes.filter(t => t !== deviceType)
                                  })
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={`new-${deviceType}`} className="text-sm capitalize">
                              {deviceType.toLowerCase().replace('_', ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Brand and Model Specificity */}
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="text-base font-medium mb-4">Service Specificity (Optional)</h4>
                      <p className="text-sm text-gray-600">
                        Leave blank for universal services, or specify to create brand/model-specific services with different pricing
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Specific Brand (Optional)</Label>
                          <Select
                            value={newService.specificBrand || ''}
                            onValueChange={async (value) => {
                              const selectedBrand = value === 'all' ? null : value;
                              setNewService({ 
                                ...newService, 
                                specificBrand: selectedBrand,
                                specificModel: null // Reset model when brand changes
                              });
                              
                              // Load models for the selected brand
                              if (selectedBrand) {
                                await loadModelsForBrand(selectedBrand);
                              } else {
                                setAvailableModels([]);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All brands" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All brands</SelectItem>
                              {availableBrands.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                  {brand}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Specific Model (Optional)</Label>
                          <Select
                            value={newService.specificModel || ''}
                            onValueChange={(value) => setNewService({ 
                              ...newService, 
                              specificModel: value === 'all' ? null : value
                            })}
                            disabled={!newService.specificBrand}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={
                                !newService.specificBrand 
                                  ? "Select a brand first" 
                                  : "All models"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All models</SelectItem>
                              {availableModels.map((model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!newService.specificBrand && (
                            <p className="text-xs text-gray-500">Select a brand first to specify a model</p>
                          )}
                        </div>
                      </div>

                      {newService.specificBrand && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Service Scope:</strong> This service will be available for{' '}
                            {newService.specificModel 
                              ? `${newService.specificBrand} ${newService.specificModel} only`
                              : `all ${newService.specificBrand} devices`
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleAddService} 
                      disabled={!newService.name || !newService.basePrice || newService.deviceTypes.length === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </CardContent>
                </Card>

                {/* Service Type Filter */}
                <div className="space-y-3">
                  <Label>Filter by Device Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      size="sm"
                      variant={selectedServiceDeviceType === null ? "default" : "outline"}
                      onClick={() => setSelectedServiceDeviceType(null)}
                    >
                      All Services
                    </Button>
                    {deviceTypes.map((deviceType) => (
                      <Button
                        key={deviceType}
                        size="sm"
                        variant={selectedServiceDeviceType === deviceType ? "default" : "outline"}
                        onClick={() => setSelectedServiceDeviceType(deviceType)}
                      >
                        <span className="capitalize">
                          {deviceType.toLowerCase().replace('_', ' ')}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Services List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {selectedServiceDeviceType 
                        ? `${selectedServiceDeviceType.toLowerCase().replace('_', ' ')} Services` 
                        : 'All Services'
                      } ({(selectedServiceDeviceType ? getServicesForDeviceType(selectedServiceDeviceType) : services.filter(s => s.isActive)).length})
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    {(selectedServiceDeviceType ? getServicesForDeviceType(selectedServiceDeviceType) : services.filter(s => s.isActive))
                      .map((service) => (
                        <Card key={service.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">{service.name}</h4>
                                {service.popularity && (
                                  <Badge variant="secondary" className="text-xs">
                                    {service.popularity}
                                  </Badge>
                                )}
                                <Badge 
                                  variant={service.isActive ? "default" : "secondary"} 
                                  className="text-xs"
                                >
                                  {service.isActive ? "Active" : "Inactive"}
                                </Badge>
                                {service.specificBrand && (
                                  <Badge variant="outline" className="text-xs">
                                    {service.specificModel 
                                      ? `${service.specificBrand} ${service.specificModel}`
                                      : `${service.specificBrand} only`
                                    }
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {service.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Base Price: ${service.basePrice}</span>
                                <span>Time: {service.estimatedTime}min</span>
                                <span>
                                  Scope: {service.specificModel 
                                    ? `${service.specificBrand} ${service.specificModel} only`
                                    : service.specificBrand 
                                      ? `All ${service.specificBrand} devices`
                                      : 'Universal'
                                  }
                                </span>
                                <span>
                                  Compatible: {service.deviceTypes.map((type: DeviceType) =>
                                    type.toLowerCase().replace('_', ' ')
                                  ).join(', ')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingService(service)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteService(service.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>

                  {(selectedServiceDeviceType ? getServicesForDeviceType(selectedServiceDeviceType) : services.filter(s => s.isActive)).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>
                        {selectedServiceDeviceType 
                          ? `No services configured for ${selectedServiceDeviceType.toLowerCase().replace('_', ' ')}` 
                          : 'No services configured'
                        }
                      </p>
                      <p className="text-sm">Add your first service above to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Catalog Settings</CardTitle>
                <CardDescription>
                  Configure catalog preferences and defaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>

      {/* Device Edit Modal */}
      {editingDevice && (
        <Dialog open={!!editingDevice} onOpenChange={() => setEditingDevice(null)}>
          <DialogContent className="w-screen h-screen max-w-none max-h-none overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-lg">Edit Device</DialogTitle>
              <DialogDescription className="text-base">
                Update device information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Device Type</Label>
                  <Select
                    value={editingDevice.type}
                    onValueChange={(value) => setEditingDevice({ ...editingDevice, type: value as DeviceType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMARTPHONE">Smartphone</SelectItem>
                      <SelectItem value="TABLET">Tablet</SelectItem>
                      <SelectItem value="LAPTOP">Laptop</SelectItem>
                      <SelectItem value="SMARTWATCH">Smartwatch</SelectItem>
                      <SelectItem value="DESKTOP">Desktop</SelectItem>
                      <SelectItem value="GAMING_CONSOLE">Gaming Console</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editingDevice.order}
                    onChange={e => setEditingDevice({ ...editingDevice, order: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Input
                    value={editingDevice.brand}
                    onChange={(e) => setEditingDevice({ ...editingDevice, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input
                    value={editingDevice.model}
                    onChange={(e) => setEditingDevice({ ...editingDevice, model: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Series/Family</Label>
                  <Input
                    value={editingDevice.series || ''}
                    placeholder="e.g., iPhone 15, Galaxy S, A Series"
                    onChange={(e) => setEditingDevice({ ...editingDevice, series: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Upload for Edit */}
              <div className="space-y-4">
                <Label>Device Image</Label>
                <div className="flex items-center space-x-4">
                  {editingDevice.imageUrl && (
                    <div className="w-20 h-20 border rounded-lg overflow-hidden">
                      <img 
                        src={editingDevice.imageUrl} 
                        alt="Device preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <FileUpload
                      onUploadComplete={(fileUrl, key) => {
                        setEditingDevice({ ...editingDevice, imageUrl: fileUrl });
                      }}
                      onUploadError={(error) => {
                        console.error('Upload error:', error);
                        alert('Failed to upload image. Please try again.');
                      }}
                      accept="image/*"
                      maxSize={5}
                      multiple={false}
                      disabled={uploadingDeviceImage}
                      label="Drop device image here or click to browse"
                      description="Recommended: 300x300px, max 5MB"
                      className="h-32"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingDevice.description || ''}
                  onChange={(e) => setEditingDevice({ ...editingDevice, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditingDevice(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateDevice}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Part Edit Modal */}
      {editingPart && (
        <Dialog open={!!editingPart} onOpenChange={() => setEditingPart(null)}>
          <DialogContent className="w-screen h-screen max-w-none max-h-none overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-lg">Edit Part</DialogTitle>
              <DialogDescription className="text-base">
                Update part information and inventory
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Part Name</Label>
                  <Input
                    value={editingPart.name}
                    onChange={(e) => setEditingPart({ ...editingPart, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input
                    value={editingPart.sku}
                    onChange={(e) => setEditingPart({ ...editingPart, sku: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingPart.cost}
                    onChange={(e) => setEditingPart({ ...editingPart, cost: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>In Stock</Label>
                  <Input
                    type="number"
                    value={editingPart.inStock}
                    onChange={(e) => setEditingPart({ ...editingPart, inStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Stock</Label>
                  <Input
                    type="number"
                    value={editingPart.minStock}
                    onChange={(e) => setEditingPart({ ...editingPart, minStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Input
                    value={editingPart.supplier}
                    onChange={(e) => setEditingPart({ ...editingPart, supplier: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={editingPart.order || 0}
                    onChange={(e) => setEditingPart({ ...editingPart, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Device Compatibility Section for Edit */}
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h4 className="text-base font-medium mb-4">Device Compatibility</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Device Type</Label>
                      <Select
                        value={editingPart.deviceType || ''}
                        onValueChange={(value) => setEditingPart({ ...editingPart, deviceType: value || null })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Universal (All Types)</SelectItem>
                          <SelectItem value="SMARTPHONE">Smartphone</SelectItem>
                          <SelectItem value="TABLET">Tablet</SelectItem>
                          <SelectItem value="LAPTOP">Laptop</SelectItem>
                          <SelectItem value="SMARTWATCH">Smartwatch</SelectItem>
                          <SelectItem value="DESKTOP">Desktop</SelectItem>
                          <SelectItem value="GAMING_CONSOLE">Gaming Console</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Leave blank for universal parts compatible with all device types
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Specific Device Model</Label>
                      <Select
                        value={editingPart.deviceModel || ''}
                        onValueChange={(value) => {
                          // If 'all', clear deviceModel; else, store device id
                          setEditingPart({ ...editingPart, deviceModel: value === 'all' ? null : value })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Universal (All Models)</SelectItem>
                          {(editingPart.deviceType && editingPart.deviceType !== 'all'
                            ? allDevices.filter((d) => d.type === editingPart.deviceType)
                            : allDevices
                          ).map((device) => (
                            <SelectItem key={device.id} value={device.id}>
                              {device.brand} {device.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Specify exact model for precise compatibility matching
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload for Edit */}
              <div className="space-y-4">
                <Label>Part Image</Label>
                <div className="flex items-center space-x-4">
                  {editingPart.imageUrl && (
                    <div className="w-20 h-20 border rounded-lg overflow-hidden">
                      <img 
                        src={editingPart.imageUrl} 
                        alt="Part preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <FileUpload
                      onUploadComplete={(fileUrl, key) => {
                        setEditingPart({ ...editingPart, imageUrl: fileUrl });
                      }}
                      onUploadError={(error) => {
                        console.error('Upload error:', error);
                        alert('Failed to upload image. Please try again.');
                      }}
                      accept="image/*"
                      maxSize={5}
                      multiple={false}
                      disabled={uploadingPartImage}
                      label="Drop part image here or click to browse"
                      description="Recommended: 300x300px, max 5MB"
                      className="h-32"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingPart.description || ''}
                  onChange={(e) => setEditingPart({ ...editingPart, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Quality Selection */}
              <div className="space-y-2">
                <Label>Quality</Label>
                <Select
                  value={editingPart.quality || ''}
                  onValueChange={(value) => setEditingPart({ ...editingPart, quality: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OEM">OEM</SelectItem>
                    <SelectItem value="Incell">Incell</SelectItem>
                    <SelectItem value="Original">Original</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Aftermarket">Aftermarket</SelectItem>
                    <SelectItem value="Refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditingPart(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePart}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Service Edit Modal */}
      {editingService && (
        <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
          <DialogContent className="w-screen h-screen max-w-none max-h-none overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-lg">Edit Service</DialogTitle>
              <DialogDescription className="text-base">
                Update service information and pricing
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Name</Label>
                  <Input
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Base Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingService.basePrice}
                    onChange={(e) => setEditingService({ ...editingService, basePrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Time (minutes)</Label>
                  <Input
                    type="number"
                    value={editingService.estimatedTime}
                    onChange={(e) => setEditingService({ ...editingService, estimatedTime: parseInt(e.target.value) || 60 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Popularity</Label>
                  <Select
                    value={editingService.popularity || ''}
                    onValueChange={(value) => setEditingService({ 
                      ...editingService, 
                      popularity: value === '' ? null : value as "Most Popular" | "Popular"
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select popularity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="Popular">Popular</SelectItem>
                      <SelectItem value="Most Popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Brand and Model Specification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Specific Brand (Optional)</Label>
                  <Select
                    value={editingService.specificBrand || ''}
                    onValueChange={async (value) => {
                      const selectedBrand = value === 'all' ? null : value;
                      setEditingService({ 
                        ...editingService, 
                        specificBrand: selectedBrand,
                        specificModel: null // Reset model when brand changes
                      });
                      
                      // Load models for the selected brand
                      if (selectedBrand) {
                        await loadModelsForBrand(selectedBrand);
                      } else {
                        setAvailableModels([]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All brands</SelectItem>
                      {availableBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Specific Model (Optional)</Label>
                  <Select
                    value={editingService.specificModel || ''}
                    onValueChange={(value) => setEditingService({ 
                      ...editingService, 
                      specificModel: value === 'all' ? null : value
                    })}
                    disabled={!editingService.specificBrand}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !editingService.specificBrand 
                          ? "Select a brand first" 
                          : "All models"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All models</SelectItem>
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!editingService.specificBrand && (
                    <p className="text-xs text-gray-500">Select a brand first to specify a model</p>
                  )}
                </div>
              </div>

              editingService.specificBrand && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Service Scope:</strong> This service will be available for{' '}
                    {editingService.specificModel 
                      ? `${editingService.specificBrand} ${editingService.specificModel} only`
                      : `all ${editingService.specificBrand} devices`
                    }
                  </p>
                </div>
              )

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Compatible Device Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {deviceTypes.map((deviceType) => (
                    <div key={deviceType} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`edit-${deviceType}`}
                        checked={editingService.deviceTypes.includes(deviceType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditingService({
                              ...editingService,
                              deviceTypes: [...editingService.deviceTypes, deviceType]
                            })
                          } else {
                            setEditingService({
                              ...editingService,
                              deviceTypes: editingService.deviceTypes.filter((t: DeviceType) => t !== deviceType)
                            })
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`edit-${deviceType}`} className="text-sm capitalize">
                        {deviceType.toLowerCase().replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingService.isActive}
                  onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Service is active and available</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditingService(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateService}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
