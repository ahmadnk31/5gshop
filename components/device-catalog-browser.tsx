'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { usePagination } from "@/hooks/use-pagination"
import { 
  ChevronRight, 
  ArrowLeft, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Watch, 
  Monitor,
  Wrench,
  DollarSign,
  Clock,
  Package,
  Gamepad2,
  ShoppingCart
} from "lucide-react"
import { DeviceType, Part, RepairService } from '@/lib/types'
import { 
  getDeviceTypes, 
  getBrandsByType, 
  getModelsByBrand, 
  getPartsByDeviceModel,
  getRepairServicesForDevice
} from '@/app/actions/device-catalog-actions'
import {  getAllDevicesByOrder, getAllDevicesByModelName } from '@/app/actions/device-management-actions'
import { useTranslations } from 'next-intl';
import { useCart } from "@/components/cart-context";

import { FallbackImage } from './ui/fallback-image'
import { Link } from '@/i18n/navigation'
import { formatCurrency } from '@/lib/utils'
import { PartActionButtons } from '@/app/[locale]/parts/[id]/part-action-buttons'

// Brand logo mapping - image URLs for brand logos
const brandLogos: Record<string, { imageUrl: string; color: string; bgColor: string }> = {
  'Apple': { 
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg', 
    color: 'text-gray-800', 
    bgColor: 'bg-gray-100' 
  },
  'Samsung': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Google': { 
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-50' 
  },
  'Huawei': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Huawei_Logo.svg', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50' 
  },
  'Xiaomi': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo.svg', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50' 
  },
  'OnePlus': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/OnePlus_logo.svg', 
    color: 'text-red-500', 
    bgColor: 'bg-red-50' 
  },
  'Sony': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Sony_logo.svg', 
    color: 'text-blue-700', 
    bgColor: 'bg-blue-50' 
  },
  'LG': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/LG_logo.svg', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50' 
  },
  'Motorola': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Motorola_logo.svg', 
    color: 'text-blue-800', 
    bgColor: 'bg-blue-50' 
  },
  'Nokia': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Nokia_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'HTC': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/HTC_logo.svg', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50' 
  },
  'BlackBerry': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/BlackBerry_logo.svg', 
    color: 'text-gray-800', 
    bgColor: 'bg-gray-100' 
  },
  'ASUS': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Acer': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Acer_logo.svg', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50' 
  },
  'Dell': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'HP': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Lenovo': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Lenovo_logo_2015.svg', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50' 
  },
  'MSI': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/MSI_logo.svg', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50' 
  },
  'Razer': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Razer_logo.svg', 
    color: 'text-green-500', 
    bgColor: 'bg-green-50' 
  },
  'Alienware': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Alienware_logo.svg', 
    color: 'text-gray-800', 
    bgColor: 'bg-gray-100' 
  },
  'Microsoft': { 
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Gigabyte': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Gigabyte_logo.svg', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50' 
  },
  'ASRock': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/ASRock_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'EVGA': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/EVGA_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Nintendo': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50' 
  },
  'PlayStation': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Xbox': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50' 
  },
  'Steam': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg', 
    color: 'text-gray-800', 
    bgColor: 'bg-gray-100' 
  },
  'Oculus': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Oculus_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Meta': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Fitbit': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Fitbit_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Garmin': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Garmin_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'GoPro': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/GoPro_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Canon': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Canon_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Nikon': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Nikon_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Fujifilm': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Fujifilm_logo.svg', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50' 
  },
  'Panasonic': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Panasonic_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Olympus': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Olympus_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Leica': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Leica_logo.svg', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50' 
  },
  'DJI': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/DJI_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Parrot': { 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Parrot_logo.svg', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  'Generic': { 
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100' 
  },
  'Other': { 
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100' 
  },
  'Unknown': { 
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100' 
  },
}

// Helper function to get brand logo
const getBrandLogo = (brandName: string) => {
  const normalizedBrand = brandName.trim()
  return brandLogos[normalizedBrand] || brandLogos['Generic']
}

interface BreadcrumbItem {
  label: string
  value?: string
}

const deviceIcons: Record<DeviceType, React.ComponentType<any>> = {
  SMARTPHONE: Smartphone,
  TABLET: Tablet,
  LAPTOP: Laptop,
  SMARTWATCH: Watch,
  DESKTOP: Monitor,
  GAMING_CONSOLE: Gamepad2,
  OTHER: Package,
}

const deviceDisplayNames: Record<DeviceType, string> = {
  SMARTPHONE: 'Smartphones',
  TABLET: 'Tablets',
  LAPTOP: 'Laptops',
  SMARTWATCH: 'Smartwatches',
  DESKTOP: 'Desktops',
  GAMING_CONSOLE: 'Gaming Consoles',
  OTHER: 'Other Devices',
}

interface DeviceCatalogBrowserProps {
  searchTerm?: string;
  serialOrder?: 'asc' | 'desc';
}

function DeviceCatalogBrowserContent({ searchTerm, serialOrder = 'desc' }: DeviceCatalogBrowserProps) {
  const t = useTranslations('device-catalog-browser');
  const { addToCart } = useCart();
  const searchParams = useSearchParams()
  const [currentLevel, setCurrentLevel] = useState<'types' | 'brands' | 'models' | 'parts'>('types')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  
  const [deviceTypes, setDeviceTypes] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [parts, setParts] = useState<any[]>([])
  const [services, setServices] = useState<RepairService[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [devices, setDevices] = useState<any[]>([]) // Add devices state for image display
  
  const [loading, setLoading] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [order, setOrder] = useState<'asc' | 'desc'>(serialOrder);

  // Pagination hooks
  const searchPagination = usePagination({
    totalItems: searchResults.length,
    itemsPerPage: 12,
  });
  
  const modelsPagination = usePagination({
    totalItems: models.length,
    itemsPerPage: 12,
  });
  
  const partsPagination = usePagination({
    totalItems: parts.length,
    itemsPerPage: 12,
  });

  // Device type mapping for URL parameters
  const urlToDeviceTypeMap: Record<string, DeviceType> = {
    'smartphone': 'SMARTPHONE',
    'tablet': 'TABLET',
    'laptop': 'LAPTOP',
    'smartwatch': 'SMARTWATCH',
    'desktop': 'DESKTOP',
    'gaming_console': 'GAMING_CONSOLE',
    'other': 'OTHER'
  }

  // Load device types on mount and handle URL parameters
  useEffect(() => {
    const type = searchParams.get('type')
    const urlSearchTerm = searchParams.get('search') || searchTerm
    
    if (urlSearchTerm && type && urlToDeviceTypeMap[type]) {
      // Both search term and device type - perform filtered search
      const deviceType = urlToDeviceTypeMap[type]
      setSelectedType(deviceType)
      setIsSearchMode(true)
      performFilteredSearch(urlSearchTerm, deviceType)
    } else if (urlSearchTerm) {
      // Only search term - perform general search
      setIsSearchMode(true)
      performSearch(urlSearchTerm)
    } else if (type && urlToDeviceTypeMap[type]) {
      // Only device type - auto-select the device type
      const deviceType = urlToDeviceTypeMap[type]
      setSelectedType(deviceType)
      setIsSearchMode(false)
      selectDeviceType(deviceType)
    } else {
      // No parameters - load all device types
      setIsSearchMode(false)
      loadDeviceTypes()
    }
  }, [searchParams, searchTerm])

  const performSearch = async (query: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/search/repairs?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        let results = await response.json()
        // Filter out incomplete results (missing id, name, cost/price, imageUrl, inStock)
        results = results.filter((part: any) => {
          const hasId = !!part.id;
          const hasName = !!part.name;
          const hasCost = typeof part.cost === 'number' && !isNaN(part.cost) && part.cost > 0;
          const hasImage = !!part.imageUrl;
          const hasStock = typeof part.inStock === 'number';
          return hasId && hasName && hasCost && hasImage && hasStock;
        });
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error performing search:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const performFilteredSearch = async (query: string, deviceType: DeviceType) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/search/repairs?q=${encodeURIComponent(query)}&deviceType=${deviceType}`)
      if (response.ok) {
        let results = await response.json()
        // Filter results to only show the selected device type
        results = results.filter((result: any) => 
          (result.deviceType === deviceType || result.deviceType === 'GENERAL') &&
          !!result.id && !!result.name && typeof result.cost === 'number' && !isNaN(result.cost) && result.cost > 0 && !!result.imageUrl && typeof result.inStock === 'number'
        );
        setSearchResults(results)
      }
    } catch (error) {
      console.error('Error performing filtered search:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDeviceTypes = async () => {
    setLoading(true)
    try {
      const types = await getDeviceTypes()
      setDeviceTypes(types)
    } catch (error) {
      console.error('Error loading device types:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDevicesForBrand = async (deviceType: DeviceType, brand: string, order: 'asc' | 'desc' = 'desc') => {
    try {
      // Use the new backend sorting functionality
      const allDevices = await getAllDevicesByModelName(order);
      // Filter devices by type and brand
      let filteredDevices = allDevices.filter((device: any) => 
        device.type === deviceType && device.brand === brand
      );
      setDevices(filteredDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  }

  const selectDeviceType = async (type: string) => {
    setLoading(true)
    try {
      setSelectedType(type as DeviceType)
      const brandsData = await getBrandsByType(type as DeviceType)
      const servicesData = await getRepairServicesForDevice(type as DeviceType)
      setBrands(brandsData)
      setServices(servicesData)
      setCurrentLevel('brands')
      
      // Scroll to show the results after a brief delay
      setTimeout(() => {
        const browserSection = document.getElementById('device-browser');
        if (browserSection) {
          const navHeight = 80; // Account for sticky navigation
          const elementTop = browserSection.offsetTop - navHeight;
          window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error loading brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectBrand = async (brand: string) => {
    if (!selectedType) return
    
    setLoading(true)
    try {
      setSelectedBrand(brand)
      modelsPagination.goToFirstPage(); // Reset pagination when selecting new brand
      
      // Load devices with images for this brand FIRST
      await loadDevicesForBrand(selectedType as DeviceType, brand, order);
      
      // Then load and sort models using the device data
      const modelsData = await getModelsByBrand(selectedType as DeviceType, brand)
      // Sort models according to current order (now devices are loaded)
      const sortedModels = sortModelsArray(modelsData, order)
      setModels(sortedModels)
      
      // Load brand-specific services
      const servicesData = await getRepairServicesForDevice(selectedType as DeviceType, brand)
      setServices(servicesData)
      setCurrentLevel('models')
      
      // Scroll to keep the user in context
      setTimeout(() => {
        const browserSection = document.getElementById('device-browser');
        if (browserSection) {
          const navHeight = 80;
          const elementTop = browserSection.offsetTop - navHeight;
          window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error loading models:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectModel = async (model: string) => {
    if (!selectedType) {
      console.error('Missing selectedType:', { selectedType })
      return
    }
    setLoading(true)
    try {
      let brandToUse: string | undefined = selectedBrand || undefined;
      setSelectedModel(model)
      partsPagination.goToFirstPage(); // Reset pagination when selecting new model
      // Try to load parts with selectedBrand (may be undefined)
      let partsData: any[] = [];
      try {
        partsData = await getPartsByDeviceModel(selectedType as DeviceType, brandToUse || '', model)
      } catch (e) {
        partsData = [];
      }
      // If no brand, try to infer from first part
      if (!brandToUse && partsData && partsData.length > 0 && partsData[0].brand) {
        brandToUse = partsData[0].brand;
        setSelectedBrand(brandToUse || null);
      }
      // Now load services with the inferred brand
      const servicesData = await getRepairServicesForDevice(selectedType as DeviceType, brandToUse, model)
      console.log(`✅ Received ${partsData.length} parts and ${servicesData.length} services for ${model}`)
      setParts(partsData)
      setServices(servicesData)
      setCurrentLevel('parts')
    } catch (error) {
      console.error('❌ Error loading parts:', error)
      console.error('❌ Error details:', {
        selectedType,
        selectedBrand,
        model,
        error: error instanceof Error ? error.message : String(error)
      })
      // Show user-friendly error
      alert(`Failed to load parts for ${model}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    switch (currentLevel) {
      case 'brands':
        // If we came from a URL parameter, go back to showing all types
        const type = searchParams.get('type')
        if (type) {
          // Remove URL parameter and show all types
          window.history.pushState({}, '', '/repairs')
        }
        setCurrentLevel('types')
        setSelectedType(null)
        setBrands([])
        setServices([])
        // Reload all device types
        loadDeviceTypes()
        break
      case 'models':
        setCurrentLevel('brands')
        setSelectedBrand(null)
        setModels([])
        break
      case 'parts':
        setCurrentLevel('models')
        setSelectedModel(null)
        setParts([])
        break
    }
  }

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [{ label: t('breadcrumbs.deviceTypes') }]
    
    if (selectedType) {
      crumbs.push({ label: deviceDisplayNames[selectedType as DeviceType], value: selectedType })
    }
    if (selectedBrand) {
      crumbs.push({ label: selectedBrand, value: selectedBrand })
    }
    if (selectedModel) {
      crumbs.push({ label: selectedModel, value: selectedModel })
    }
    
    return crumbs
  }

  const navigateToBreadcrumb = (index: number) => {
    const breadcrumbs = getBreadcrumbs()
    
    switch (index) {
      case 0: // Device Types
        setCurrentLevel('types')
        setSelectedType(null)
        setSelectedBrand(null)
        setSelectedModel(null)
        setBrands([])
        setModels([])
        setParts([])
        setServices([])
        loadDeviceTypes()
        break
      case 1: // Selected Type (go to brands)
        if (selectedType) {
          setCurrentLevel('brands')
          setSelectedBrand(null)
          setSelectedModel(null)
          setModels([])
          setParts([])
          // Keep the brands and services as they're already loaded
        }
        break
      case 2: // Selected Brand (go to models)
        if (selectedType && selectedBrand) {
          setCurrentLevel('models')
          setSelectedModel(null)
          setParts([])
          // Keep the models as they're already loaded
        }
        break
      case 3: // Selected Model (stay on parts - this is the current level)
        // Already on the parts level, no action needed
        break
    }
  }

  const handleToggleOrder = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);
    if (currentLevel === 'models' && selectedType && selectedBrand) {
      // Reload devices for brand with new order
      loadDevicesForBrand(selectedType as DeviceType, selectedBrand, newOrder);
    }
  };

  // Helper: Sort models array by the order field from the database
  const sortModelsArray = (modelsArr: string[], order: 'asc' | 'desc') => {
    return [...modelsArr].sort((a, b) => {
      // Find the corresponding device objects to get their order values
      const deviceA = devices.find(d => d.model === a);
      const deviceB = devices.find(d => d.model === b);
      
      const orderA = deviceA?.order ?? 0;
      const orderB = deviceB?.order ?? 0;
      
      // For descending order (default): higher order numbers first (newer models)
      // For ascending order: lower order numbers first (older models)
      return order === 'desc' ? orderB - orderA : orderA - orderB;
    });
  };

  // Sort models whenever order changes
  useEffect(() => {
    if (models.length > 0) {
      setModels(prev => sortModelsArray(prev, order));
    }
  }, [order, models.length]);

  // Pagination helpers
  const getPaginatedItems = (items: any[], pagination: any) => {
    return items.slice(pagination.startIndex, pagination.endIndex + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Indicator */}
      {searchParams.get('type') && selectedType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {t('filter.filteredBy', { type: deviceDisplayNames[selectedType as DeviceType] })}
              </Badge>
              <span className="text-sm text-blue-700">
                {t('filter.showing', { type: deviceDisplayNames[selectedType as DeviceType] })}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                window.history.pushState({}, '', '/repairs')
                setCurrentLevel('types')
                setSelectedType(null)
                setBrands([])
                setServices([])
                loadDeviceTypes()
              }}
            >
              {t('filter.showAllDevices')}
            </Button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearchMode && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              {t('search.resultsTitle', { type: selectedType ? deviceDisplayNames[selectedType as DeviceType] : '' })}
            </h3>
            <p className="text-gray-600">
              {t('search.resultsFound', {
                count: searchResults.length,
                type: selectedType ? deviceDisplayNames[selectedType as DeviceType] : '',
                search: (searchTerm || searchParams.get('search') || '')
              })}
            </p>
            {selectedType && (
              <Badge variant="secondary" className="mt-2">
                {t('filter.filteredBy', { type: deviceDisplayNames[selectedType as DeviceType] })}
              </Badge>
            )}
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-2">{t('searchResults.searching')}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getPaginatedItems(searchResults, searchPagination).map((part) => (
                  <Card key={part.id} className='relative'>
                    
                    <Link href={`/parts/${part.id}`} className="block  rounded-t-lg">
                      {part.imageUrl && (
                        <div className="relative h-32 overflow-hidden">
                          <FallbackImage
                            src={part.imageUrl}
                            alt={part.name}
                            className="w-full h-full object-cover"
                            fallbackContent={
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            }
                          />
                        </div>
                      )}
                    </Link>
                    <Link href={`/parts/${part.id}`} className="hover:underline">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <Link href={`/parts/${part.id}`} className="flex items-center hover:underline">
                          <Package className="h-5 w-5 mr-2 text-blue-600" />
                          {part.name}
                        </Link>
                        <Badge
                          variant={part.inStock > 0 ? "default" : "destructive"}
                          className={
                            part.inStock > 0
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {part.inStock > 0 ? t('parts.inStock') : t('parts.outOfStock')}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                          SKU: {part.sku}
                      </CardDescription>
                    </CardHeader>
                    <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {part.quality ? t(`parts.qualityOptions.${part.quality.toLowerCase()}`) || part.quality : t('parts.unknownQuality')}
                          </Badge>
                        </div>
                    </Link>
                    <CardContent>
                      <div className="space-y-2">
                      <Link href={`/parts/${part.id}`} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('parts.stock')}:</span>
                          <span className={part.inStock <= part.minStock ? 'text-red-600' : 'text-green-600'}>
                            {part.inStock} {t('parts.units')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t('parts.price')}:</span>
                          <span className="font-medium">{formatCurrency(part.cost,'EUR')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t('parts.supplier')}:</span>
                          <span>{part.supplier}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t('parts.quality')}:</span>
                          <span>{part.quality ? t(`parts.qualityOptions.${part.quality.toLowerCase()}`) || part.quality : t('parts.unknownQuality')}</span>
                        </div>
                        </Link>
                        <div className="pt-2 flex space-x-2">
                          <Button asChild size="sm" className="flex-1" variant="outline">
                            <Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType ?? part.device_type ?? selectedType ?? '')}&brand=${encodeURIComponent(selectedBrand ?? part.brand ?? '')}&model=${encodeURIComponent(selectedModel ?? part.deviceModel ?? '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality ?? '')}&sku=${encodeURIComponent(part.sku ?? '')}&supplier=${encodeURIComponent(part.supplier ?? '')}`}>
                              {t('parts.requestQuote')}
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            disabled={part.inStock <= 0}
                            onClick={() => {
                              addToCart({
                                id: part.id,
                                name: part.name,
                                price: part.cost,
                                image: part.imageUrl,
                                type:"part"
                              });
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span className="sr-only">
                              {part.inStock > 0 ? t('parts.addToCart', { defaultValue: 'Add to Cart' }) : t('parts.outOfStock', { defaultValue: 'Out of Stock' })}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Search Results Pagination */}
              {searchResults.length > 12 && (
                <div className="mt-8">
                  <PaginationControls 
                    pagination={searchPagination}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">{t('search.noResults')}</h3>
              <p className="text-gray-600 mb-4">
                {t('search.noResultsDesc', { search: (searchTerm || searchParams.get('search') || '') })}
              </p>
              <Button 
                onClick={() => {
                  setIsSearchMode(false)
                  setSearchResults([])
                  window.history.pushState({}, '', '/repairs')
                  loadDeviceTypes()
                }}
              >
                {t('searchResults.browseAllServices')}
              </Button>
            </div>
          )}
          <div className="text-center border-t pt-6">
            <div className="flex gap-3 justify-center">
              {selectedType && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Keep search but remove device type filter
                    const url = new URL(window.location.href)
                    url.searchParams.delete('type')
                    window.history.pushState({}, '', url.toString())
                    setSelectedType(null)
                    const currentSearch = searchTerm || searchParams.get('search')
                    if (currentSearch) {
                      performSearch(currentSearch)
                    }
                  }}
                >
                  {t('searchResults.searchAllDeviceTypes')}
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchResults([])
                  setSelectedType(null)
                  window.history.pushState({}, '', '/repairs')
                  loadDeviceTypes()
                }}
              >
                {t('searchResults.browseAllDeviceTypes')}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Back Button */}
      {currentLevel !== 'types' && (
        <Button 
          variant="outline" 
          onClick={goBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('navigation.back')}
        </Button>
      )}
      {/* Regular Browse Mode - only show when not in search mode */}
      {!isSearchMode && (
        <>
      {/* Breadcrumb Navigation */}
      <nav
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600"
        aria-label="Breadcrumb"
      >
        {getBreadcrumbs().map((crumb, index) => (
          <div key={index} className="flex items-center min-w-0 max-w-full">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 shrink-0" aria-hidden="true" />
            )}
            {index === getBreadcrumbs().length - 1 ? (
              // Current page - not clickable
              <span className="font-medium text-gray-900 truncate block max-w-[120px] sm:max-w-xs md:max-w-sm lg:max-w-md" title={crumb.label}>
                {crumb.label}
              </span>
            ) : (
              // Previous levels - clickable
              <button
                onClick={() => navigateToBreadcrumb(index)}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate block max-w-[120px] sm:max-w-xs md:max-w-sm lg:max-w-md"
                title={crumb.label}
                type="button"
              >
                {crumb.label}
              </button>
            )}
          </div>
        ))}
      </nav>

      

      {/* Device Types Level */}
      {currentLevel === 'types' && (
        <div className="space-y-4">
          {searchParams.get('type') && selectedType ? (
            // Show filtered message when coming from URL parameter
            <div className="text-center py-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-2">
                  {deviceDisplayNames[selectedType as DeviceType]} {t('deviceSelected.selected')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('deviceSelected.chooseBrand', { type: deviceDisplayNames[selectedType as DeviceType] })}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => selectDeviceType(selectedType)}
                    className="flex items-center space-x-2"
                  >
                    <span>{t('deviceSelected.continue', { type: deviceDisplayNames[selectedType as DeviceType] })}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      window.history.pushState({}, '', '/repairs')
                      setSelectedType(null)
                      loadDeviceTypes()
                    }}
                  >
                    {t('deviceSelected.showAllTypes')}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Show all device types grid
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {deviceTypes.map((type) => {
                const deviceType = type as DeviceType
                const Icon = deviceIcons[deviceType]
                return (
                  <Card 
                    key={type} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => selectDeviceType(type)}
                  >
                    <CardHeader className="text-center">
                      <Icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                      <CardTitle>{deviceDisplayNames[deviceType]}</CardTitle>
                      <CardDescription>
                        {t('types.browse', { type: deviceDisplayNames[deviceType] })}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Brands Level */}
      {currentLevel === 'brands' && selectedType && (
        <Tabs defaultValue="brands" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="brands">{t('tabs.brands')}</TabsTrigger>
            <TabsTrigger value="services">{t('tabs.repairServices')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="brands" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {brands.map((brand) => {
                const brandLogo = getBrandLogo(brand);
                return (
                  <Card 
                    key={brand}
                    className="cursor-pointer hover:shadow-lg pt-0 h-auto transition-shadow"
                    onClick={() => selectBrand(brand)}
                  >
                    <CardHeader className="p-0 pb-2">
                      <div className="flex items-center justify-center w-full h-full">
                        <div className={` ${brandLogo.bgColor} w-full flex items-center justify-center ${brandLogo.color} overflow-hidden`}>
                          <div className="w-full h-full flex items-center justify-center p-4">
                            <FallbackImage
                              src={brandLogo.imageUrl}
                              alt={`${brand} logo`}
                              width={100}
                              height={150}
                              className="object-contain h-[150px] w-full"
                              fallbackContent={
                                <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                                  <Package className="w-8 h-8" />
                                </div>
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardTitle className="text-center text-lg font-semibold mb-2">
                        {brand}
                      </CardTitle>
                      <CardDescription className="text-center text-sm flex items-center justify-between">
                        {t('brands.viewModels', { brand: brand, type: deviceDisplayNames[selectedType as DeviceType] })}
                        <div className="flex justify-center mt-3">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                      </CardDescription>
                      
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="h-5 w-5 mr-2 text-blue-600" />
                      {service.name}
                    </CardTitle>
                    {service.description && (
                      <CardDescription>{service.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {t('services.startingAt', { price: formatCurrency(service.basePrice) })}
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/quote?deviceType=${selectedType}&service=${encodeURIComponent(service.name)}`}>
                          {t('services.getQuote')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Models Level */}
      {currentLevel === 'models' && selectedBrand && (
        <div className="space-y-6">
          {/* Model Search/Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedBrand} {deviceDisplayNames[selectedType as DeviceType]}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('models.selectModel')}
              </p>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder={t('models.filterPlaceholder')}
                className="px-3 py-2 border border-gray-300 flex-1 w-full sm:w-auto rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase()
                  const modelCards = document.querySelectorAll('[data-model-card]')
                  modelCards.forEach(card => {
                    const modelName = card.getAttribute('data-model-name')?.toLowerCase() || ''
                    const seriesContainer = card.closest('[data-series-container]')
                    if (modelName.includes(searchTerm)) {
                      ;(card as HTMLElement).style.display = 'block'
                    } else {
                      ;(card as HTMLElement).style.display = 'none'
                    }
                    // Hide series if no models are visible
                    if (seriesContainer) {
                      const visibleCards = seriesContainer.querySelectorAll('[data-model-card]:not([style*="display: none"])')
                      ;(seriesContainer as HTMLElement).style.display = visibleCards.length > 0 ? 'block' : 'none'
                    }
                  })
                }}
              />
            </div>
          </div>
          {/* Order Toggle Button */}
          <div className="flex items-center justify-end mb-2">
            <Button size="sm" variant="outline" onClick={handleToggleOrder}>
              {order === 'asc' ? t('models.sortAsc', { defaultValue: 'Sort: Ascending' }) : t('models.sortDesc', { defaultValue: 'Sort: Descending' })}
            </Button>
          </div>
          {(() => {
            // Group sorted models by device.series if available, else fallback to parsing
            const modelGroups: Record<string, string[]> = {};
            models.forEach(model => {
              const deviceObj = devices.find(d => d.model === model);
              let groupKey = deviceObj?.series || null;
              if (!groupKey) {
                // fallback to old parsing logic
                groupKey = model;
                if (model.includes('iPhone')) {
                  const match = model.match(/iPhone (\d+)/);
                  if (match) groupKey = `iPhone ${match[1]}`;
                } else if (model.includes('Galaxy S')) {
                  const match = model.match(/Galaxy S(\d+)/);
                  if (match) groupKey = `Galaxy S${match[1]}`;
                } else if (model.includes('MacBook')) {
                  groupKey = model.split(' ').slice(0, 2).join(' ');
                } else if (model.includes('iPad')) {
                  groupKey = model.split(' ').slice(0, 2).join(' ');
                } else if (model.includes('Watch')) {
                  groupKey = model.split(' ').slice(0, 3).join(' ');
                }
              }
              if (!modelGroups[groupKey]) modelGroups[groupKey] = [];
              modelGroups[groupKey].push(model);
            });
            
            const allModels = Object.values(modelGroups).flat();
            const paginatedModels = getPaginatedItems(allModels, modelsPagination);
            
            return (
              <>
                {Object.entries(modelGroups).map(([seriesName, seriesModels]) => {
                  const paginatedSeriesModels = seriesModels.filter(model => 
                    paginatedModels.includes(model)
                  );
                  
                  if (paginatedSeriesModels.length === 0) return null;
                  
                  return (
                    <div key={seriesName} className="space-y-4" data-series-container>
                      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                         {t('models.series', { series: seriesName , brand: deviceDisplayNames[selectedType as DeviceType] })}
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({seriesModels.length} {t('models.model', { count: seriesModels.length })})
                        </span>
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedSeriesModels.map((model) => {
                          const deviceWithImage = devices.find(device => device.model === model)
                          return (
                            <Card 
                              key={model}
                              className="cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => selectModel(model)}
                              data-model-card
                              data-model-name={model}
                            >
                              {deviceWithImage?.imageUrl && (
                                <div className="relative h-48 overflow-hidden">
                                  <FallbackImage
                                    src={deviceWithImage.imageUrl}
                                    alt={`${selectedBrand} ${model}`}
                                    className="w-full h-full object-cover"
                                    fallbackContent={
                                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <Package className="h-12 w-12 text-gray-400" />
                                      </div>
                                    }
                                  />
                                </div>
                              )}
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  {model}
                                  <ChevronRight className="h-4 w-4" />
                                </CardTitle>
                                <CardDescription>
                                  {t('models.viewParts', { brand: selectedBrand, model: model })}
                                </CardDescription>
                              </CardHeader>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                
                {/* Models Pagination */}
                {allModels.length > 12 && (
                  <div className="mt-8">
                    <PaginationControls 
                      pagination={modelsPagination}
                    />
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}

      {/* Parts Level */}
      {currentLevel === 'parts' && selectedModel && (
        <Tabs defaultValue="parts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parts">{t('tabs.availableParts')}</TabsTrigger>
            <TabsTrigger value="services">{t('tabs.repairServices')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parts" className="space-y-4">
            {parts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getPaginatedItems(parts, partsPagination).map((part) => (
                    <Card key={part.id} className="relative">
                      {part.imageUrl && (
                        <Link href={`/parts/${part.id}`}>
                          <div className="relative h-32 overflow-hidden">
                            <FallbackImage
                              src={part.imageUrl}
                              alt={part.name}
                              className="w-full h-full object-cover"
                              fallbackContent={
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              }
                            />
                          </div>
                        </Link>
                      )}
                      <Link href={`/parts/${part.id}`}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center">
                             
                              {part.name}
                            </span>
                            <Badge variant={part.inStock > part.minStock ? "default" : "destructive"}>
                              {part.inStock > 0 ? t('parts.inStock') : t('parts.outOfStock')}
                            </Badge>
                          </CardTitle>
                          <CardDescription>SKU: {part.sku}</CardDescription>
                        </CardHeader>
                      </Link>
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="secondary" className="text-xs">
                          {part.quality ? t(`parts.qualityOptions.${part.quality.toLowerCase()}`) || part.quality : t('parts.unknownQuality')}
                        </Badge>
                      </div>
                      <div className="absolute top-2 left-2 z-10">
                  <PartActionButtons part={part} />
                </div>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t('parts.stock')}:</span>
                            <span className={part.inStock <= part.minStock ? 'text-red-600' : 'text-green-600'}>
                              {part.inStock} {t('parts.units')}
                            </span>
                          </div>
                          <div className="flex  text-sm md:text-lg xl:text-xl text-blue-500 font-bold justify-between text-sm">
                            <span>{t('parts.price')}:</span>
                            <span className="font-medium">{formatCurrency(part.cost,'EUR')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{t('parts.supplier')}:</span>
                            <span>{part.supplier}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{t('parts.quality')}:</span>
                            <span>{part.quality ? t(`parts.qualityOptions.${part.quality.toLowerCase()}`) || part.quality : t('parts.unknownQuality')}</span>
                          </div>
                          <div className="pt-2 flex space-x-2">
                            <Button asChild size="sm" className="flex-1" variant="outline">
                              <Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType ?? part.device_type ?? selectedType ?? '')}&brand=${encodeURIComponent(selectedBrand ?? part.brand ?? '')}&model=${encodeURIComponent(selectedModel ?? part.deviceModel ?? '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality ?? '')}&sku=${encodeURIComponent(part.sku ?? '')}&supplier=${encodeURIComponent(part.supplier ?? '')}`}>
                                {t('parts.requestQuote')}
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              disabled={part.inStock <= 0}
                              onClick={() => {
                                addToCart({
                                  id: part.id,
                                  name: part.name,
                                  price: part.cost,
                                  image: part.imageUrl,
                                });
                              }}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span className="sr-only">
                                {part.inStock > 0 ? t('parts.addToCart', { defaultValue: 'Add to Cart' }) : t('parts.outOfStock', { defaultValue: 'Out of Stock' })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Parts Pagination */}
                {parts.length > 12 && (
                  <div className="mt-8">
                    <PaginationControls 
                      pagination={partsPagination}
                    />
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>{t('parts.noParts')}</p>
                    <p className="text-sm mt-2">
                      {t('parts.contactForParts')}
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/contact">{t('parts.contactUs')}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="h-5 w-5 mr-2 text-blue-600" />
                      {service.name}
                    </CardTitle>
                    <CardDescription>
                      {t('services.forModel', { brand: selectedBrand || '', model: selectedModel || '' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {t('services.estimatedCost')}:
                        </span>
                        <span className="font-medium">Starting at {formatCurrency(service.basePrice,'EUR')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className='flex items-center'>
                          <Clock className="h-4 w-4 mr-1" />
                          {t('services.estimatedTime')}:</span>
                        <span className="font-medium">{service.estimatedTime} {t('services.minutes', { minutes: service.estimatedTime })}</span>
                      </div>
                      <Button asChild size="sm" className="w-full">
                        <Link href={`/quote?deviceType=${selectedType || ''}&brand=${encodeURIComponent(selectedBrand || '')}&model=${encodeURIComponent(selectedModel || '')}&service=${encodeURIComponent(service.name)}`}>
                          {t('services.getDetailedQuote')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
        </>
      )}
    </div>
  )
}

export default function DeviceCatalogBrowser({ searchTerm, serialOrder = 'desc' }: DeviceCatalogBrowserProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <DeviceCatalogBrowserContent searchTerm={searchTerm} serialOrder={serialOrder} />
    </Suspense>
  );
}
