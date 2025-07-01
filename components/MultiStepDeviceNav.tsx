'use client'
import { useEffect, useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { useTranslations } from 'next-intl'

import { getBrandsByType } from '@/app/actions/device-catalog-actions'
import { getModelsByBrandDetailed } from '@/app/actions/device-management-actions'
import { getPartsByDeviceModel } from '@/app/actions/device-catalog-actions'
import { DeviceType } from '@/lib/types'
import { Link } from '@/i18n/navigation'

// Helper to group models by series
function groupModelsBySeries(models: { model: string, series?: string | null }[]) {
  const grouped: Record<string, string[]> = {}
  models.forEach(({ model, series }) => {
    const key = series || 'Other'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(model)
  })
  return grouped
}

// Helper to build part detail URL
function getPartUrl(part: any) {
  return `/parts/${part.id}`;
}

export function MultiStepDeviceNav({ deviceType = 'SMARTPHONE' }: { deviceType?: DeviceType }) {
  const [brands, setBrands] = useState<string[]>([])
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null)
  const [seriesMap, setSeriesMap] = useState<Record<string, string[]>>({})
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null)
  const [models, setModels] = useState<string[]>([])
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  const [parts, setParts] = useState<any[]>([])
  const [loadingParts, setLoadingParts] = useState(false)
  const t = useTranslations('multiDeviceNav')

  // Load brands on mount
  useEffect(() => {
    getBrandsByType(deviceType).then(setBrands)
  }, [deviceType])

  // Load models/series when a brand is hovered
  useEffect(() => {
    if (hoveredBrand) {
      getModelsByBrandDetailed(hoveredBrand).then((devices) => {
        // Group by series if available
        const grouped = groupModelsBySeries(devices)
        setSeriesMap(grouped)
        setHoveredSeries(null)
        setModels([])
      })
    } else {
      setSeriesMap({})
      setHoveredSeries(null)
      setModels([])
    }
  }, [hoveredBrand])

  // Set models when a series is hovered
  useEffect(() => {
    if (hoveredSeries && seriesMap[hoveredSeries]) {
      setModels(seriesMap[hoveredSeries])
    } else {
      setModels([])
    }
  }, [hoveredSeries, seriesMap])

  // Fetch parts when a model is hovered
  useEffect(() => {
    if (hoveredModel && hoveredBrand) {
      setLoadingParts(true)
      getPartsByDeviceModel(deviceType, hoveredBrand, hoveredModel)
        .then((data) => setParts(data))
        .finally(() => setLoadingParts(false))
    } else {
      setParts([])
    }
  }, [hoveredModel, hoveredBrand, deviceType])

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base font-medium">
              {t('browse')}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  className="flex min-h-[220px] overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
                  onMouseLeave={() => {
                    setHoveredBrand(null);
                    setHoveredSeries(null);
                    setHoveredModel(null);
                  }}
                >
                  {/* Brands column */}
                  <div className="min-w-[160px] border-r pr-2 max-h-[80vh] overflow-y-auto">
                    <div className="font-semibold text-gray-700 px-4 py-2">{t('brands')}</div>
                    {brands.map(brand => (
                      <div
                        key={brand}
                        onMouseEnter={() => setHoveredBrand(brand)}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${hoveredBrand === brand ? 'bg-blue-100 font-semibold' : ''}`}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                  {/* Series column */}
                  <div className="min-w-[180px] border-r pr-2 max-h-[500px] overflow-y-auto">
                    <div className="font-semibold text-gray-700 px-4 py-2">{t('series')}</div>
                    {hoveredBrand && Object.keys(seriesMap).length > 0 ? (
                      Object.keys(seriesMap).map(series => (
                        <div
                          key={series}
                          onMouseEnter={() => setHoveredSeries(series)}
                          className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${hoveredSeries === series ? 'bg-blue-100 font-semibold' : ''}`}
                        >
                          {series}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400">Hover a brand</div>
                    )}
                  </div>
                  {/* Models column */}
                  <div className="min-w-[220px] border-r pr-2 max-h-[500px] overflow-y-auto">
                    <div className="font-semibold text-gray-700 px-4 py-2">{t('models')}</div>
                    {models.length > 0 ? (
                      models.map(model => (
                        <div
                          key={model}
                          onMouseEnter={() => setHoveredModel(model)}
                        >
                          <Link
                            href={`/parts?type=${deviceType.toLowerCase()}&brand=${encodeURIComponent(hoveredBrand!)}&model=${encodeURIComponent(model)}`}
                            className={`block px-4 py-2 hover:bg-blue-50 ${hoveredModel === model ? 'bg-blue-100 font-semibold' : ''}`}
                          >
                            {model}
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400">Hover a series</div>
                    )}
                  </div>
                  {/* Parts column */}
                  <div className="min-w-[260px] max-h-[500px] overflow-y-auto">
                    <div className="font-semibold text-gray-700 px-4 py-2">{t('parts')}</div>
                    {loadingParts ? (
                      <div className="px-4 py-2 text-gray-400">Loading parts...</div>
                    ) : parts.length > 0 ? (
                      <ul className="px-4 py-2 space-y-1">
                        {parts.map(part => (
                          <li key={part.id} className="text-sm text-gray-800">
                            <Link href={getPartUrl(part)} className="hover:underline text-blue-700">
                              {part.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-2 text-gray-400">Hover a model</div>
                    )}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
} 