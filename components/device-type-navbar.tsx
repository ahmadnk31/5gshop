"use client"

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Watch, 
  Monitor, 
  Gamepad2,
  ChevronDown,
  Package,
  ArrowLeft
} from 'lucide-react';
import { DeviceType } from '@/lib/types';
import { FallbackImage } from '@/components/ui/fallback-image';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DeviceTypeNavbarNotFound from './device-type-navbar-not-found';
import { 
  useBrandsByType, 
  useModelsByBrand, 
  usePartsByDeviceModel
} from '@/hooks/use-data';

const deviceIcons: Record<DeviceType, React.ComponentType<any>> = {
  SMARTPHONE: Smartphone,
  TABLET: Tablet,
  LAPTOP: Laptop,
  SMARTWATCH: Watch,
  DESKTOP: Monitor,
  GAMING_CONSOLE: Gamepad2,
  OTHER: Package
};

const deviceDisplayNames: Record<DeviceType, string> = {
  SMARTPHONE: 'Smartphones',
  TABLET: 'Tablets',
  LAPTOP: 'Laptops',
  SMARTWATCH: 'Smart Watches',
  DESKTOP: 'Desktops',
  GAMING_CONSOLE: 'Gaming Consoles',
  OTHER: 'Other Devices'
};

// Helper function to convert device type to URL slug
const deviceTypeToSlug = (deviceType: DeviceType): string => {
  return deviceType.toLowerCase().replace('_', '-');
};

// Helper function to create slug from part name and ID
const createPartSlug = (name: string, id: string): string => {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
};

interface DeviceTypeNavbarProps {
  className?: string;
}

export function DeviceTypeNavbar({ className = "" }: DeviceTypeNavbarProps) {
  // Clean className to remove any z-index that might conflict, ensuring consistent z-50
  // This must be defined first to ensure it's always available
  const cleanClassName = className ? className.replace(/\bz-\d+\b/g, '').trim() : '';
  
  const t = useTranslations('repairs.deviceTypes');
  const [hoveredType, setHoveredType] = useState<DeviceType | null>(null);
  const [currentLevel, setCurrentLevel] = useState<'types' | 'brands' | 'models' | 'parts'>('types');
  const [selectedType, setSelectedType] = useState<DeviceType | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [dropdownPosition, setDropdownPosition] = useState<{left: number, top: number}>({left: 16, top: 80});
  const [mouseLeaveTimeout, setMouseLeaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // TanStack Query hooks for data fetching
  const { data: brands = [], isLoading: brandsLoading } = useBrandsByType(selectedType);
  const { data: models = [], isLoading: modelsLoading } = useModelsByBrand(selectedType, selectedBrand);
  const { data: parts = [], isLoading: partsLoading } = usePartsByDeviceModel(selectedType, selectedBrand, selectedModel);
  
  // Combined loading state
  const loading = brandsLoading || modelsLoading || partsLoading;

  const deviceTypes: DeviceType[] = [
    'SMARTPHONE',
    'TABLET', 
    'LAPTOP',
    'SMARTWATCH',
    'DESKTOP',
    'GAMING_CONSOLE',
    'OTHER'
  ];

  // Check if component is mounted (for portal)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (mouseLeaveTimeout) {
        clearTimeout(mouseLeaveTimeout);
      }
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [mouseLeaveTimeout, hoverTimeout]);


  // Handle device type selection
  const selectDeviceType = (type: DeviceType) => {
    setSelectedType(type);
    setCurrentLevel('brands');
    // Data will be automatically fetched by TanStack Query
  };

  // Handle brand selection
  const selectBrand = (brand: string) => {
    if (!selectedType) return;
    setSelectedBrand(brand);
    setCurrentLevel('models');
    // Data will be automatically fetched by TanStack Query
  };

  // Handle model selection
  const selectModel = (model: string) => {
    if (!selectedType) return;
    setSelectedModel(model);
    setCurrentLevel('parts');
    // Data will be automatically fetched by TanStack Query
  };

  // Handle mouse enter for device type
  const handleTypeMouseEnter = (deviceType: DeviceType, event: React.MouseEvent) => {
    // Clear any pending timeouts
    if (mouseLeaveTimeout) {
      clearTimeout(mouseLeaveTimeout);
      setMouseLeaveTimeout(null);
    }
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    // Always set hovered type first
    setHoveredType(deviceType);
    
    // Calculate dropdown position based on viewport
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = window.innerWidth < 1024 ? Math.min(viewportWidth - 32, 800) : 800;
    
    let left = rect.left;
    let top = rect.bottom + 4;
    
    // Adjust position if dropdown would go off screen
    if (left + dropdownWidth > viewportWidth - 16) {
      left = viewportWidth - dropdownWidth - 16;
    }
    if (left < 16) {
      left = 16;
    }
    
    // For mobile, use the actual bottom position of the clicked element
    // This ensures the dropdown appears below the navbar item, not on top of it
    if (window.innerWidth < 1024) {
      // Use the bottom of the navbar element + small gap
      top = rect.bottom + 8;
      left = 16;
    }
    
    setDropdownPosition({left, top});
    
    // Always reset state and load new data when hovering over a different device type
    if (selectedType !== deviceType) {
      // Reset all state immediately
      setSelectedBrand(null);
      setSelectedModel(null);
      
      // Load new data with a small delay to prevent rapid hover issues
      const timeout = setTimeout(() => {
        setSelectedType(deviceType);
        setCurrentLevel('brands');
      }, 50);
      setHoverTimeout(timeout);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    // Clear any existing timeouts
    if (mouseLeaveTimeout) {
      clearTimeout(mouseLeaveTimeout);
    }
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    // Keep the dropdown open for a moment to allow navigation
    const timeout = setTimeout(() => {
      setHoveredType(null);
      // Reset all state when leaving
      setCurrentLevel('types');
      setSelectedType(null);
      setSelectedBrand(null);
      setSelectedModel(null);
      // No need to clear data arrays - TanStack Query handles it
      setMouseLeaveTimeout(null);
    }, 300);
    
    setMouseLeaveTimeout(timeout);
  };

  // Go back to previous level
  const goBack = () => {
    switch (currentLevel) {
      case 'brands':
        setCurrentLevel('types');
        setSelectedType(null);
        // TanStack Query will handle cache
        break;
      case 'models':
        setCurrentLevel('brands');
        setSelectedBrand(null);
        // TanStack Query will handle cache
        break;
      case 'parts':
        setCurrentLevel('models');
        setSelectedModel(null);
        // TanStack Query will handle cache
        break;
    }
  };

  return (
    <nav className={`relative bg-white border-b border-gray-200 shadow-sm z-50 ${cleanClassName}`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide navbar-scroll min-h-[60px] items-center">
          {deviceTypes.map((deviceType) => {
            const Icon = deviceIcons[deviceType];
            const displayName = deviceDisplayNames[deviceType];
            const isHovered = hoveredType === deviceType;

            return (
              <div
                key={deviceType}
                className="relative flex-shrink-0 navbar-item "
                onMouseEnter={(e) => handleTypeMouseEnter(deviceType, e)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Main Nav Item */}
                <Link
                  href={`/repairs/${deviceTypeToSlug(deviceType)}`}
                  className={`
                    flex items-center space-x-1 sm:space-x-2 px-3 sm:px-3 lg:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0
                    ${isHovered 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-700 hover:text-green-600 hover:border-b-2 hover:border-green-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{t(deviceType === 'GAMING_CONSOLE' ? 'gamingConsole' : deviceType.toLowerCase(), { defaultValue: displayName })}</span>
                  <span className="sm:hidden">{displayName.split(' ')[0]}</span>
                  <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 flex-shrink-0 ${isHovered ? 'rotate-180' : ''}`} />
                </Link>

                {/* Multi-Step Dropdown Menu - Rendered via Portal for Safari compatibility */}
                {isHovered && mounted && createPortal(
                  <div 
                    className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] overflow-visible"
                    style={{
                      left: `${dropdownPosition.left}px`,
                      top: `${dropdownPosition.top}px`,
                      width: typeof window !== 'undefined' && window.innerWidth < 1024 ? 'calc(100vw - 32px)' : '800px',
                      maxWidth: 'calc(100vw - 32px)',
                      WebkitTransform: 'translateZ(0)', // Force hardware acceleration for Safari
                      transform: 'translateZ(0)', // Force hardware acceleration
                      willChange: 'transform', // Optimize for Safari
                      isolation: 'isolate', // Create new stacking context for Safari
                      WebkitBackfaceVisibility: 'hidden', // Safari fix
                      backfaceVisibility: 'hidden' // Safari fix
                    } as React.CSSProperties}
                    onMouseEnter={() => {
                      // Clear any pending mouse leave timeout when entering dropdown
                      if (mouseLeaveTimeout) {
                        clearTimeout(mouseLeaveTimeout);
                        setMouseLeaveTimeout(null);
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="p-2 sm:p-4">
                      {/* Header with Back Button */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          {currentLevel !== 'types' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goBack}
                              className="flex items-center space-x-1 text-xs sm:text-sm"
                            >
                              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Back</span>
                            </Button>
                          )}
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                            {currentLevel === 'types' && t(deviceType === 'GAMING_CONSOLE' ? 'gamingConsole' : deviceType.toLowerCase(), { defaultValue: displayName })}
                            {currentLevel === 'brands' && `Select Brand for ${displayName}`}
                            {currentLevel === 'models' && `Select Model for ${selectedBrand}`}
                            {currentLevel === 'parts' && `Parts for ${selectedModel}`}
                          </h3>
                        </div>
                        <Link
                          href={`/repairs/${deviceTypeToSlug(deviceType)}`}
                          className="text-xs sm:text-sm text-green-600 hover:text-green-800 font-medium whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">View All →</span>
                          <span className="sm:hidden">All →</span>
                        </Link>
                      </div>
                      
                      {/* Content based on current level */}
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                      ) : (
                        <>
                          {/* Brands Level */}
                          {currentLevel === 'brands' && (
                            <>
                              {brands.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                                  {brands.map((brand) => (
                                    <div
                                      key={brand}
                                      className="p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors bg-gray-50 border-gray-200 hover:bg-gray-100"
                                      onClick={() => selectBrand(brand)}
                                    >
                                      <h4 className="font-medium text-xs sm:text-sm text-gray-900 mb-1 truncate">
                                        {brand}
                                      </h4>
                                      <p className="text-xs text-gray-500 hidden sm:block">
                                        Click to see models
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <DeviceTypeNavbarNotFound 
                                  deviceType={displayName}
                                  onRetry={() => selectDeviceType(deviceType)}
                                />
                              )}
                            </>
                          )}

                          {/* Models Level */}
                          {currentLevel === 'models' && (
                            <>
                              {models.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 max-h-[400px] overflow-y-auto">
                                  {models.map((model) => (
                                    <div
                                      key={model}
                                      className="p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors bg-gray-50 border-gray-200 hover:bg-gray-100"
                                      onClick={() => selectModel(model)}
                                    >
                                      <h4 className="font-medium text-xs sm:text-sm text-gray-900 mb-1 line-clamp-2">
                                        {model}
                                      </h4>
                                      <p className="text-xs text-gray-500 hidden sm:block">
                                        Click to see parts
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <DeviceTypeNavbarNotFound 
                                  deviceType={`${selectedBrand} Models`}
                                  onRetry={() => selectedBrand && selectBrand(selectedBrand)}
                                />
                              )}
                            </>
                          )}

                          {/* Parts Level */}
                          {currentLevel === 'parts' && (
                            <>
                              {parts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                  {parts.slice(0, 8).map((part: any) => {
                                    const partSlug = createPartSlug(part.name, part.id);
                                    return (
                                      <Link
                                        key={part.id}
                                        href={`/parts/${partSlug}`}
                                        className="group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                      >
                                        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                                          {part.imageUrl ? (
                                            <FallbackImage
                                              src={part.imageUrl}
                                              alt={part.name}
                                              width={64}
                                              height={64}
                                              className="object-contain group-hover:scale-105 transition-transform duration-200"
                                              fallbackContent={<Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />}
                                            />
                                          ) : (
                                            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                                          )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <h4 className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 group-hover:text-green-600">
                                            {part.name}
                                          </h4>
                                          <p className="text-xs sm:text-sm text-green-600 font-semibold">
                                            {formatCurrency(part.cost, 'EUR')}
                                          </p>
                                          {part.quality && (
                                            <p className="text-xs text-gray-500 hidden sm:block">
                                              Quality: {part.quality}
                                            </p>
                                          )}
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              ) : (
                                <DeviceTypeNavbarNotFound 
                                  deviceType={`${selectedModel} Parts`}
                                  onRetry={() => selectedModel && selectModel(selectedModel)}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>,
                  document.body
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}