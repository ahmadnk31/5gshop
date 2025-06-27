'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Gamepad2
} from "lucide-react"
import { DeviceType, Part, RepairService } from '@/lib/types'
import { 
  getDeviceTypes, 
  getBrandsByType, 
  getModelsByBrand, 
  getPartsByDeviceModel,
  getRepairServicesForDevice
} from '@/app/actions/device-catalog-actions'
import { getAllDevices, getAllDevicesBySerialNumber } from '@/app/actions/device-management-actions'
import { useTranslations } from 'next-intl';
import { useCart } from "@/components/cart-context";

import { FallbackImage } from './ui/fallback-image'
import { Link } from '@/i18n/navigation'
import { formatCurrency } from '@/lib/utils'


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

function DeviceCatalogBrowserContent({ searchTerm, serialOrder = 'asc' }: DeviceCatalogBrowserProps) {
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

  const loadDevicesForBrand = async (deviceType: DeviceType, brand: string, order: 'asc' | 'desc' = 'asc') => {
    try {
      const allDevices = await getAllDevicesBySerialNumber(order);
      // Filter devices by type and brand
      const filteredDevices = allDevices.filter(device => 
        device.type === deviceType && device.brand === brand
      )
      setDevices(filteredDevices)
    } catch (error) {
      console.error('Error loading devices:', error)
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
      const modelsData = await getModelsByBrand(selectedType as DeviceType, brand)
      // Sort models according to current order
      const sortedModels = sortModelsArray(modelsData, order)
      setModels(sortedModels)
      // Load brand-specific services
      const servicesData = await getRepairServicesForDevice(selectedType as DeviceType, brand)
      setServices(servicesData)
      setCurrentLevel('models')
      
      // Load devices with images for this brand
      await loadDevicesForBrand(selectedType as DeviceType, brand, order);
      
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

  // Helper: Sort models array by numeric value in model name (if present), else alphabetically
  const sortModelsArray = (modelsArr: string[], order: 'asc' | 'desc') => {
    return [...modelsArr].sort((a, b) => {
      const anum = parseInt(a.replace(/[^\d]/g, ''))
      const bnum = parseInt(b.replace(/[^\d]/g, ''))
      if (!isNaN(anum) && !isNaN(bnum)) {
        return order === 'asc' ? anum - bnum : bnum - anum
      }
      return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
    })
  }

  // Sort models whenever order changes
  useEffect(() => {
    setModels(prev => sortModelsArray(prev, order))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((part) => (
                <Card key={part.id}>
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
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Package className="h-5 w-5 mr-2 text-blue-600" />
                        {part.name}
                      </span>
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
                    <CardDescription>SKU: {part.sku}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
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
                      <div className="pt-2">
                        <Button asChild size="sm" className="w-full">
<Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType ?? part.device_type ?? selectedType ?? '')}&brand=${encodeURIComponent(selectedBrand ?? part.brand ?? '')}&model=${encodeURIComponent(selectedModel ?? part.deviceModel ?? '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality ?? '')}&sku=${encodeURIComponent(part.sku ?? '')}&supplier=${encodeURIComponent(part.supplier ?? '')}`}>
                            {t('parts.requestQuote')}
                          </Link>
                        </Button>
                      </div>
                      <div className="pt-2">
                        <Button
                          size="sm"
                          className="w-full"
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
                          <span className="flex items-center justify-center">
                            <Package className="h-4 w-4 mr-2" />
                            {part.inStock > 0 ? t('parts.addToCart', { defaultValue: 'Add to Cart' }) : t('parts.outOfStock', { defaultValue: 'Out of Stock' })}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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

      {/* Regular Browse Mode - only show when not in search mode */}
      {!isSearchMode && (
        <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {getBreadcrumbs().map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            {index === getBreadcrumbs().length - 1 ? (
              // Current page - not clickable
              <span className="font-medium text-gray-900">
                {crumb.label}
              </span>
            ) : (
              // Previous levels - clickable
              <button
                onClick={() => navigateToBreadcrumb(index)}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                {crumb.label}
              </button>
            )}
          </div>
        ))}
      </div>

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((brand) => (
                <Card 
                  key={brand}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => selectBrand(brand)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {brand}
                      <ChevronRight className="h-4 w-4" />
                    </CardTitle>
                    <CardDescription>
                      {t('brands.viewModels', { brand: brand, type: deviceDisplayNames[selectedType as DeviceType] })}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
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
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={t('models.filterPlaceholder')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            // Sort models array by order before grouping
            const sortedModels = [...models].sort((a, b) => {
              // Try to extract numbers for numeric sort (e.g., iPhone 14, Galaxy S21)
              const getModelNumber = (model: string) => {
                const match = model.match(/(\d+)/);
                return match ? parseInt(match[1], 10) : null;
              };
              const aNum = getModelNumber(a);
              const bNum = getModelNumber(b);
              if (aNum !== null && bNum !== null) {
                return order === 'asc' ? aNum - bNum : bNum - aNum;
              }
              // Fallback to alphabetical
              return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
            });
            // Group sorted models by series (e.g., iPhone 14, iPhone 15)
            const modelGroups: Record<string, string[]> = {};
            sortedModels.forEach(model => {
              let baseModel = model;
              if (model.includes('iPhone')) {
                const match = model.match(/iPhone (\d+)/);
                if (match) baseModel = `iPhone ${match[1]}`;
              } else if (model.includes('Galaxy S')) {
                const match = model.match(/Galaxy S(\d+)/);
                if (match) baseModel = `Galaxy S${match[1]}`;
              } else if (model.includes('MacBook')) {
                baseModel = model.split(' ').slice(0, 2).join(' ');
              } else if (model.includes('iPad')) {
                baseModel = model.split(' ').slice(0, 2).join(' ');
              } else if (model.includes('Watch')) {
                baseModel = model.split(' ').slice(0, 3).join(' ');
              }
              if (!modelGroups[baseModel]) modelGroups[baseModel] = [];
              modelGroups[baseModel].push(model);
            });
            // Custom sort for each series: latest to oldest
            const sortModels = (series: string[], base: string) => {
              // iPhone: extract number, sort desc or asc
              if (base.startsWith('iPhone')) {
                return series.sort((a, b) => {
                  const anum = parseInt(a.replace(/[^\d]/g, ''));
                  const bnum = parseInt(b.replace(/[^\d]/g, ''));
                  return order === 'asc' ? anum - bnum : bnum - anum;
                });
              }
              // Galaxy S: extract number, sort desc or asc
              if (base.startsWith('Galaxy S')) {
                return series.sort((a, b) => {
                  const anum = parseInt(a.replace(/[^\d]/g, ''));
                  const bnum = parseInt(b.replace(/[^\d]/g, ''));
                  return order === 'asc' ? anum - bnum : bnum - anum;
                });
              }
              // Default: alphabetical
              return series.sort((a, b) => order === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
            };
            return Object.entries(modelGroups).map(([seriesName, seriesModels]) => (
              <div key={seriesName} className="space-y-4" data-series-container>
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                   {t('models.series', { series: seriesName , brand: deviceDisplayNames[selectedType as DeviceType] })}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({seriesModels.length} {t('models.model', { count: seriesModels.length })})
                  </span>
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortModels([...seriesModels], seriesName).map((model) => {
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
            ))
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parts.map((part) => (
                  <Card key={part.id}>
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
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Package className="h-5 w-5 mr-2 text-blue-600" />
                          {part.name}
                        </span>
                        <Badge variant={part.inStock > part.minStock ? "default" : "destructive"}>
                          {part.inStock > 0 ? t('parts.inStock') : t('parts.outOfStock')}
                        </Badge>
                      </CardTitle>
                      <CardDescription>SKU: {part.sku}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
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
                        <div className="pt-2">
                          <Button asChild size="sm" className="w-full">
                            <Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType || selectedType || '')}&brand=${encodeURIComponent(selectedBrand || part.brand || '')}&model=${encodeURIComponent(selectedModel || part.deviceModel || '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality || '')}&sku=${encodeURIComponent(part.sku || '')}&supplier=${encodeURIComponent(part.supplier || '')}`}>
                              {t('parts.requestQuote')}
                            </Link>
                          </Button>
                        </div>
                        <div className="pt-2">
                          <Button
                            size="sm"
                            className="w-full"
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
                            <span className="flex items-center justify-center">
                              <Package className="h-4 w-4 mr-2" />
                              {part.inStock > 0 ? t('parts.addToCart', { defaultValue: 'Add to Cart' }) : t('parts.outOfStock', { defaultValue: 'Out of Stock' })}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

export default function DeviceCatalogBrowser({ searchTerm, serialOrder = 'asc' }: DeviceCatalogBrowserProps) {
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
