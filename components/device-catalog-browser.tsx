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
  ShoppingCart,
  GripVertical
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
import { useSession } from 'next-auth/react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FallbackImage } from './ui/fallback-image'
import { Link } from '@/i18n/navigation'
import { formatCurrency } from '@/lib/utils'
import { PartActionButtons } from '@/app/[locale]/parts/[id]/part-action-buttons'
import { Skeleton } from '@/components/ui/skeleton';

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
    color: 'text-primary', 
    bgColor: 'bg-primary-50' 
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
    color: 'text-primary-600', 
    bgColor: 'bg-primary-50' 
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
    color: 'text-primary-500', 
    bgColor: 'bg-primary-50' 
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
    color: 'text-primary-600', 
    bgColor: 'bg-primary-50' 
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
    color: 'text-primary-600', 
    bgColor: 'bg-primary-50' 
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

type DeviceTypeSortableItemProps = {
  type: string;
  index: number;
  deviceTypes: string[];
  setDeviceTypes: (types: string[]) => void;
  isAdmin: boolean;
};
function DeviceTypeSortableItem({ type, index, deviceTypes, setDeviceTypes, isAdmin, selectDeviceType }: DeviceTypeSortableItemProps & { selectDeviceType: (type: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: type });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isAdmin ? 'grab' : 'pointer',
    background: isDragging ? '#e0e7ff' : undefined,
  };
  const deviceType = type as DeviceType;
  const Icon = deviceIcons[deviceType];
  // Track if currently dragging to prevent click
  const [dragging, setDragging] = useState(false);
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-white rounded shadow mb-2 cursor-pointer"
      onClick={() => { if (!dragging) { selectDeviceType(type); } }}
    >
      {isAdmin && (
        <span
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab text-gray-400 hover:text-blue-600 focus:outline-none"
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setTimeout(() => setDragging(false), 100)}
          onPointerLeave={() => setTimeout(() => setDragging(false), 100)}
        >
          <GripVertical className="h-5 w-5" />
        </span>
      )}
      <Icon className="h-8 w-8 text-blue-600" />
      <span className="font-semibold text-lg">{deviceDisplayNames[deviceType]}</span>
    </div>
  );
}

type ModelSortableItemProps = {
  model: string;
  deviceWithImage: any;
  isAdmin: boolean;
  onClick: (model: string) => void;
};
function ModelSortableItem({ model, deviceWithImage, isAdmin, onClick }: ModelSortableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: model });
  return (
    <div
      ref={setNodeRef}
      className={`relative cursor-pointer group hover:shadow-2xl transition-all bg-white rounded-xl border border-gray-200 ${isDragging ? 'opacity-60 ring-2 ring-blue-300' : ''}`}
      onClick={() => onClick(model)}
      style={{ minHeight: 200, boxShadow: isDragging ? '0 4px 24px 0 rgba(59,130,246,0.10)' : undefined }}
    >
      <div className="flex flex-col items-center justify-center p-6 h-full">
        <div className="flex items-center w-full mb-4">
          {isAdmin && (
            <span
              {...attributes}
              {...listeners}
              className="p-1 cursor-grab text-gray-400 hover:text-blue-600 focus:outline-none transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="h-5 w-5" />
            </span>
          )}
          <div className="flex-1 flex justify-center">
            {deviceWithImage?.imageUrl ? (
              <div className="relative h-32 w-32 rounded-lg overflow-hidden shadow-sm border border-gray-100 bg-white">
                <FallbackImage
                  src={deviceWithImage.imageUrl}
                  alt={model}
                  className="w-full h-full object-contain"
                  fallbackContent={
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-300" />
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="h-32 w-32 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                <Package className="h-12 w-12 text-gray-300" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full text-center mt-2">
          <div className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors truncate">{model}</div>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-block bg-gray-100 text-blue-700 text-xs px-2 py-1 rounded-full shadow-sm">View</span>
        </div>
      </div>
    </div>
  
  );
}

type PartSortableItemProps = {
  part: any;
  isAdmin: boolean;
  onClick: (part: any) => void;
};
function PartSortableItem({ part, isAdmin, onClick }: PartSortableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: part.id });
  return (
    <div
      ref={setNodeRef}
      className={`relative cursor-pointer hover:shadow-lg transition-shadow bg-white rounded ${isDragging ? 'opacity-50 bg-blue-50' : ''}`}
      onClick={() => onClick(part)}
      style={{ minHeight: 120 }}
    >
      <div className="flex flex-row items-center gap-4 px-4 py-3">
        {isAdmin && (
          <span
            {...attributes}
            {...listeners}
            className="mr-3 p-1 cursor-grab text-gray-400 hover:text-blue-600 focus:outline-none"
            title="Drag to reorder"
            style={{ alignSelf: 'flex-start' }}
          >
            <GripVertical className="h-5 w-5" />
          </span>
        )}

        <div className="flex-shrink-0">
          {part.imageUrl ? (
            <div className="relative h-20 w-20 flex items-center justify-center">
              <FallbackImage
                src={part.imageUrl}
                alt={part.name}
                width={80}
                height={80}
                className="object-contain w-full h-full"
                fallbackContent={
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                }
              />
            </div>
          ) : (
            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded border border-gray-200">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pl-4">
          <div className="font-semibold text-base md:text-lg lg:text-xl truncate text-gray-900">{part.name}</div>
        </div>
      </div>
    </div>
  );
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
  const [modelToDeviceMap, setModelToDeviceMap] = useState<Record<string, any>>({}) // Map models to devices for images
  
  const [loading, setLoading] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [order, setOrder] = useState<'asc' | 'desc'>(serialOrder);
  const [modelSearch, setModelSearch] = useState('');

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

  // Add simple in-memory cache for search results
  const searchCache = new Map<string, any[]>();
  const filteredSearchCache = new Map<string, any[]>();

  // Load device types on mount and handle URL parameters
  useEffect(() => {
    const type = searchParams.get('type')
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
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
      // Device type specified - restore navigation state
      const deviceType = urlToDeviceTypeMap[type]
      setSelectedType(deviceType)
      setIsSearchMode(false)
      
      if (model && brand) {
        // Full navigation path: type -> brand -> model
        setSelectedBrand(brand)
        setSelectedModel(model)
        setCurrentLevel('parts')
        // Load the full navigation state
        restoreNavigationState(deviceType, brand, model)
      } else if (brand) {
        // Partial navigation: type -> brand
        setSelectedBrand(brand)
        setCurrentLevel('models')
        // Load brands and models
        restoreBrandState(deviceType, brand)
      } else {
        // Only device type - load brands
        setCurrentLevel('brands')
        selectDeviceType(deviceType)
      }
    } else {
      // No parameters - load all device types
      setIsSearchMode(false)
      loadDeviceTypes()
    }
  }, [searchParams, searchTerm])

  // Helper functions to restore navigation state from URL
  const restoreNavigationState = async (deviceType: DeviceType, brand: string, model: string) => {
    setLoading(true)
    try {
      // Load all necessary data for the full navigation path
      const [brandsData, modelsData, partsData, servicesData] = await Promise.all([
        getBrandsByType(deviceType),
        getModelsByBrand(deviceType, brand),
        getPartsByDeviceModel(deviceType, brand, model),
        getRepairServicesForDevice(deviceType, brand, model)
      ])
      
      setBrands(brandsData)
      setModels(sortModelsArray(modelsData, order))
      setParts(partsData)
      setServices(servicesData)
    } catch (error) {
      console.error('Error restoring navigation state:', error)
    } finally {
      setLoading(false)
    }
  }

  const restoreBrandState = async (deviceType: DeviceType, brand: string) => {
    setLoading(true)
    try {
      // Load brands and models for the brand level
      const [brandsData, modelsData, servicesData] = await Promise.all([
        getBrandsByType(deviceType),
        getModelsByBrand(deviceType, brand),
        getRepairServicesForDevice(deviceType, brand)
      ])
      
      setBrands(brandsData)
      setModels(sortModelsArray(modelsData, order))
      setServices(servicesData)
    } catch (error) {
      console.error('Error restoring brand state:', error)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (query: string) => {
    setLoading(true)
    const cacheKey = query.trim().toLowerCase();
    if (searchCache.has(cacheKey)) {
      setSearchResults(searchCache.get(cacheKey) || []);
      setLoading(false);
      return;
    }
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
        searchCache.set(cacheKey, results);
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
    const cacheKey = `${query.trim().toLowerCase()}|${deviceType}`;
    if (filteredSearchCache.has(cacheKey)) {
      setSearchResults(filteredSearchCache.get(cacheKey) || []);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/search/repairs?q=${encodeURIComponent(query)}&deviceType=${deviceType}`)
      if (response.ok) {
        let results = await response.json()
        // Filter results to only show the selected device type
        results = results.filter((result: any) => 
          (result.deviceType === deviceType || result.deviceType === 'GENERAL') &&
          !!result.id && !!result.name && typeof result.cost === 'number' && !isNaN(result.cost) && result.cost > 0 && !!result.imageUrl && typeof result.inStock === 'number'
        );
        filteredSearchCache.set(cacheKey, results);
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
      return filteredDevices; // Return the devices so they can be used immediately
    } catch (error) {
      console.error('Error loading devices:', error);
      return [];
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
      
      // Update URL to maintain navigation state
      const url = new URL(window.location.href)
      url.searchParams.set('type', type.toLowerCase())
      window.history.pushState({}, '', url.toString())
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
      modelsPagination.goToFirstPage();
      
      // Load devices first and wait for them to be set
      const loadedDevices = await loadDevicesForBrand(selectedType as DeviceType, brand, order);
      
      // Create a map of model names to devices for quick lookup
      const deviceMap: Record<string, any> = {};
      loadedDevices.forEach(device => {
        deviceMap[device.model] = device;
      });
      setModelToDeviceMap(deviceMap);
      
      const modelsData = await getModelsByBrand(selectedType as DeviceType, brand)
      const sortedModels = sortModelsArray(modelsData, order)
      setModels(sortedModels)
      
      const servicesData = await getRepairServicesForDevice(selectedType as DeviceType, brand)
      setServices(servicesData)
      setCurrentLevel('models')
      
      // Update URL to maintain navigation state
      const url = new URL(window.location.href)
      url.searchParams.set('brand', brand)
      window.history.pushState({}, '', url.toString())
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
      
      // Update URL to maintain navigation state
      const url = new URL(window.location.href)
      url.searchParams.set('model', model)
      window.history.pushState({}, '', url.toString())
      
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
        // Clear all URL parameters
        window.history.pushState({}, '', '/repairs')
        loadDeviceTypes()
        break
      case 1: // Selected Type (go to brands)
        if (selectedType) {
          setCurrentLevel('brands')
          setSelectedBrand(null)
          setSelectedModel(null)
          setModels([])
          setParts([])
          // Update URL to only include type
          const url = new URL(window.location.href)
          url.searchParams.delete('brand')
          url.searchParams.delete('model')
          window.history.pushState({}, '', url.toString())
          // Keep the brands and services as they're already loaded
        }
        break
      case 2: // Selected Brand (go to models)
        if (selectedType && selectedBrand) {
          setCurrentLevel('models')
          setSelectedModel(null)
          setParts([])
          // Update URL to only include type and brand
          const url = new URL(window.location.href)
          url.searchParams.delete('model')
          window.history.pushState({}, '', url.toString())
          // Keep the models as they're already loaded
        }
        break
      case 3: // Selected Model (stay on parts - this is the current level)
        // Already on the parts level, no action needed
        break
    }
  }

  const handleToggleOrder = async () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);
    if (currentLevel === 'models' && selectedType && selectedBrand) {
      // Reload devices for brand with new order and update models
      const loadedDevices = await loadDevicesForBrand(selectedType as DeviceType, selectedBrand, newOrder);
      
      // Update the device map
      const deviceMap: Record<string, any> = {};
      loadedDevices.forEach(device => {
        deviceMap[device.model] = device;
      });
      setModelToDeviceMap(deviceMap);
      
      const modelsData = await getModelsByBrand(selectedType as DeviceType, selectedBrand);
      const sortedModels = sortModelsArray(modelsData, newOrder);
      setModels(sortedModels);
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

  // Add this useEffect after all state and function declarations
  useEffect(() => {
    if (currentLevel === 'brands' || currentLevel === 'models' || currentLevel === 'parts') {
      const browserSection = document.getElementById('device-browser');
      if (browserSection) {
        const navHeight = 80;
        const elementTop = browserSection.offsetTop - navHeight;
        window.scrollTo({
          top: elementTop,
          behavior: 'smooth',
        });
      }
    }
  }, [currentLevel]);

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  // Drag-and-drop state for device types
  const [deviceTypesOrder, setDeviceTypesOrder] = useState(deviceTypes);
  useEffect(() => { setDeviceTypesOrder(deviceTypes); }, [deviceTypes]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [orderChanged, setOrderChanged] = useState(false);
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = deviceTypesOrder.indexOf(active.id as string);
      const newIndex = deviceTypesOrder.indexOf(over.id as string);
      const newOrder = arrayMove(deviceTypesOrder, oldIndex, newIndex);
      setDeviceTypesOrder(newOrder);
      setOrderChanged(true);
    }
  };
  const handleSaveOrder = async () => {
    // Send new order to API
    await fetch('/api/devices/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceTypesOrder.map((type, idx) => ({ id: type, order: idx })))
    });
    setOrderChanged(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-2">
              <Skeleton className="w-full aspect-square mb-3" />
              <Skeleton className="w-2/3 h-5 mb-2" />
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-full h-8 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="device-browser">
      {/* Filter Indicator */}
      {searchParams.get('type') && selectedType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 w-fit">
                {t('filter.filteredBy', { type: deviceDisplayNames[selectedType as DeviceType] })}
              </Badge>
              <span className="text-sm text-blue-700">
                {t('filter.showing', { type: deviceDisplayNames[selectedType as DeviceType] })}
              </span>
            </div>
            <div className="mt-2 sm:mt-0 w-full sm:w-auto flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto"
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
                  <Card key={part.id} className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <Link href={`/parts/${part.id}`} className="block">
                      {/* Image Section */}
                      <div className="relative h-40 bg-gray-50 flex items-center justify-center p-3">
                        {part.imageUrl ? (
                          <FallbackImage
                            src={part.imageUrl}
                            alt={part.name}
                            width={200}
                            height={200}
                            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
                            fallbackContent={
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-12 w-12 text-gray-400" />
                              </div>
                            }
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Quality Badge */}
                        {part.quality && (
                          <div className="absolute top-3 left-3 z-10">
                            <Badge 
                              variant="secondary" 
                              className="text-xs font-bold bg-white/95 backdrop-blur-sm border-2 shadow-lg text-gray-900"
                            >
                              {part.quality}
                            </Badge>
                          </div>
                        )}
                        
                        {/* Stock Status Badge - Only show when out of stock */}
                        {part.inStock <= 0 && (
                          <div className="absolute top-3 right-3 z-10">
                            <Badge 
                              variant="secondary"
                              className="text-xs font-bold bg-red-500 text-white border-2 shadow-lg"
                            >
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-3 space-y-2">
                        {/* Name */}
                        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                          {part.name}
                        </h3>
                        
                       
                        
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(part.cost, 'EUR')}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="pt-1 flex space-x-2">
                          <Button asChild size="sm" className="flex-1" variant="outline">
                            <Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType ?? part.device_type ?? selectedType ?? '')}&brand=${encodeURIComponent(selectedBrand ?? part.brand ?? '')}&model=${encodeURIComponent(selectedModel ?? part.deviceModel ?? '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality ?? '')}&sku=${encodeURIComponent(part.sku ?? '')}&supplier=${encodeURIComponent(part.supplier ?? '')}`}>
                              Quote
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
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
                              {part.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Link>
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
                  {t('search.results.searchAllDeviceTypes')}
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
        className="flex flex-wrap mb-6 p-4 bg-gray-50 rounded-lg items-center gap-x-2 gap-y-1 text-sm text-gray-600"
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
          {isAdmin ? (
            <div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={deviceTypesOrder} strategy={verticalListSortingStrategy}>
                  {deviceTypesOrder.map((type, idx) => (
                    <DeviceTypeSortableItem key={type} type={type} index={idx} deviceTypes={deviceTypesOrder} setDeviceTypes={setDeviceTypesOrder} isAdmin={isAdmin} selectDeviceType={selectDeviceType} />
                  ))}
                </SortableContext>
              </DndContext>
              {orderChanged && (
                <Button className="mt-4" onClick={handleSaveOrder}>
                  Save Order
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 xl:gap-6">
              {deviceTypes.map((type) => {
                const deviceType = type as DeviceType
                const Icon = deviceIcons[deviceType]
                return (
                  <Card 
                    key={type} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => selectDeviceType(type)}
                  >
                    <CardHeader className="text-center p-4">
                      <Icon className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                      <CardTitle className="text-base font-medium">{deviceDisplayNames[deviceType]}</CardTitle>
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
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => selectBrand(brand)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 mb-3 flex items-center justify-center">
                          <FallbackImage
                            src={brandLogo.imageUrl}
                            alt={`${brand} logo`}
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                            fallbackContent={
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-6 h-6" />
                              </div>
                            }
                          />
                        </div>
                        <CardTitle className="text-center text-base font-medium">
                          {brand}
                        </CardTitle>
                      </div>
                    </CardHeader>
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
                value={modelSearch}
                onChange={e => setModelSearch(e.target.value)}
              />
            </div>
          </div>
          {/* Order Toggle Button */}
          <div className="flex items-center justify-end mb-2">
            <Button size="sm" variant="outline" onClick={handleToggleOrder}>
              {order === 'desc' ? t('models.sortAsc', { defaultValue: 'Sort: Ascending' }) : t('models.sortDesc', { defaultValue: 'Sort: Descending' })}
            </Button>
          </div>
          {isAdmin ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={event => {
              const { active, over } = event;
              if (!over) return;
              if (active.id !== over.id) {
                const oldIndex = models.indexOf(active.id as string);
                const newIndex = models.indexOf(over.id as string);
                const newOrder = arrayMove(models, oldIndex, newIndex);
                setModels(newOrder);
                setOrderChanged(true);
              }
            }}>
              <SortableContext items={models} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {models
                    .filter(model => model.toLowerCase().includes(modelSearch.toLowerCase()))
                    .map((model) => {
                      const deviceWithImage = modelToDeviceMap[model];
                      return (
                        <ModelSortableItem
                          key={model}
                          model={model}
                          deviceWithImage={deviceWithImage}
                          isAdmin={isAdmin}
                          onClick={selectModel}
                        />
                      );
                    })}
                </div>
              </SortableContext>
              {orderChanged && (
                <Button className="mt-4" onClick={async () => {
                  await fetch('/api/devices/models/reorder', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(models.map((model, idx) => {
                      const device = devices.find(d => d.model === model);
                      return { id: device?.id, order: idx };
                    }))
                  });
                  setOrderChanged(false);
                  // Reload devices and models to reflect new order from backend
                  if (selectedType && selectedBrand) {
                    await loadDevicesForBrand(selectedType as DeviceType, selectedBrand, order);
                    const modelsData = await getModelsByBrand(selectedType as DeviceType, selectedBrand);
                    const sortedModels = sortModelsArray(modelsData, order);
                    setModels(sortedModels);
                  }
                }}>
                  Save Model Order
                </Button>
              )}
            </DndContext>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {models
                .filter(model => model.toLowerCase().includes(modelSearch.toLowerCase()))
                .map((model) => {
                  const deviceWithImage = modelToDeviceMap[model];
                  return (
                    <Card 
                      key={model}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => selectModel(model)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex flex-col items-center justify-center">
                          {deviceWithImage?.imageUrl ? (
                            <div className="h-28 w-28 mb-3 flex items-center justify-center">
                              <FallbackImage
                                src={deviceWithImage.imageUrl}
                                alt={model}
                                width={112}
                                height={112}
                                className="object-contain w-full h-full"
                                fallbackContent={
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-8 w-8 text-gray-400" />
                                  </div>
                                }
                              />
                            </div>
                          ) : (
                            <div className="h-28 w-28 mb-3 flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <CardTitle className="text-center text-base font-medium">
                            {model}
                          </CardTitle>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
            </div>
          )}
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
            {isAdmin ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={event => {
                const { active, over } = event;
                if (!over) return;
                if (active.id !== over.id) {
                  const oldIndex = parts.findIndex((p) => p.id === active.id);
                  const newIndex = parts.findIndex((p) => p.id === over.id);
                  const newOrder = arrayMove(parts, oldIndex, newIndex);
                  setParts(newOrder);
                  setOrderChanged(true);
                }
              }}>
                <SortableContext items={parts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                    {parts.map((part) => (
                      <PartSortableItem
                        key={part.id}
                        part={part}
                        isAdmin={isAdmin}
                        onClick={() => window.location.href = `/parts/${part.id}`}
                      />
                    ))}
                  </div>
                </SortableContext>
                {orderChanged && (
                  <Button className="mt-4" onClick={async () => {
                    await fetch('/api/parts/reorder', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(parts.map((part, idx) => ({ id: part.id, order: idx })))
                    });
                    setOrderChanged(false);
                  }}>
                    Save Parts Order
                  </Button>
                )}
              </DndContext>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {parts.map((part) => (
                  <Card key={part.id} className="relative overflow-hidden hover:shadow-lg py-0 transition-shadow cursor-pointer group">
                    <Link href={`/parts/${part.id}`} className="block">
                      {/* Image Section */}
                      <div className="relative h-40 bg-gray-50 flex items-center justify-center p-3">
                        {part.imageUrl ? (
                          <FallbackImage
                            src={part.imageUrl}
                            alt={part.name}
                            width={200}
                            height={200}
                            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
                            fallbackContent={
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-12 w-12 text-gray-400" />
                              </div>
                            }
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Quality Badge */}
                        {part.quality && (
                          <div className="absolute top-3 left-3 z-10">
                            <Badge 
                              variant="secondary" 
                              className="text-xs font-bold bg-white/95 backdrop-blur-sm border-2 shadow-lg text-gray-900"
                            >
                              {part.quality}
                            </Badge>
                          </div>
                        )}
                        
                        {/* Stock Status Badge - Only show when out of stock */}
                        {part.inStock <= 0 && (
                          <div className="absolute top-3 right-3 z-10">
                            <Badge 
                              variant="secondary"
                              className="text-xs font-bold bg-red-500 text-white border-2 shadow-lg"
                            >
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-3 space-y-2">
                        {/* Name */}
                        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                          {part.name}
                        </h3>
                        
                        
                        
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(part.cost, 'EUR')}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="pt-1 flex space-x-2">
                          <Button asChild size="sm" className="flex-1" variant="outline">
                            <Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType ?? part.device_type ?? selectedType ?? '')}&brand=${encodeURIComponent(selectedBrand ?? part.brand ?? '')}&model=${encodeURIComponent(selectedModel ?? part.deviceModel ?? '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality ?? '')}&sku=${encodeURIComponent(part.sku ?? '')}&supplier=${encodeURIComponent(part.supplier ?? '')}`}>
                              Quote
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
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
                              {part.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
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
    </section>
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
