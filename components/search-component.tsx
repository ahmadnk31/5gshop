"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  X, 
  Package, 
  ChevronDown,
  Shield,
  Battery,
  Cable,
  Headphones,
  Speaker,
  Camera
} from "lucide-react";


import { Link, useRouter } from '@/i18n/navigation';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { addSearchHistory } from '@/lib/view-history';
import { FallbackImage } from '@/components/ui/fallback-image';
type SearchFilter = 'all' | 'parts' | 'accessories';

interface SearchResult {
  id: string;
  title: string;
  type: 'accessory' | 'part';
  category?: string;
  deviceType?: string;
  price?: number;
  url: string;
  description?: string;
  matchScore?: number;
  imageUrl?: string; // Optional image URL for the result
}

export function SearchComponent() {
  const t = useTranslations('search');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('all');
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Query key based on search term and filter
  const searchQueryKey = ['search', searchTerm, filter];

  // Search function for react-query - memoized for performance
  const fetchSearchResults = useCallback(async (): Promise<SearchResult[]> => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      return [];
    }
    
    const searchResults: SearchResult[] = [];
    
    // Use Promise.allSettled for better error handling and parallel requests
    const promises = [];
    
    if (filter === 'parts' || filter === 'all') {
      promises.push(
        fetch(`/api/search/repairs?q=${encodeURIComponent(searchTerm)}`).then(response => 
          response.ok ? response.json() : []
        ).catch(() => [])
      );
    } else {
      promises.push(Promise.resolve([]));
    }
    
    if (filter === 'accessories' || filter === 'all') {
      promises.push(
        fetch(`/api/search/accessories?q=${encodeURIComponent(searchTerm)}`).then(response => 
          response.ok ? response.json() : []
        ).catch(() => [])
      );
    } else {
      promises.push(Promise.resolve([]));
    }

    const [partsData, accessoriesData] = await Promise.allSettled(promises);
    
    // Process parts data
    if (partsData.status === 'fulfilled' && Array.isArray(partsData.value)) {
      partsData.value.forEach((part: any) => {
        searchResults.push({
          id: part.id,
          title: part.name || part.title,
          type: 'part',
          deviceType: part.deviceType,
          price: part.price,
          category: part.category || t('categories.replacementPart'),
          url: part.url,
          description: part.description,
          matchScore: part.matchScore,
          imageUrl: part.imageUrl || '/placeholder.png',
        });
      });
    }
    
    // Process accessories data
    if (accessoriesData.status === 'fulfilled' && Array.isArray(accessoriesData.value)) {
      accessoriesData.value.forEach((acc: any) => {
        searchResults.push({
          id: acc.id,
          title: acc.name || acc.title,
          type: 'accessory',
          deviceType: acc.deviceType,
          price: acc.price,
          category: acc.category || t('categories.accessory'),
          url: acc.url,
          description: acc.description,
          matchScore: acc.matchScore,
          imageUrl: acc.imageUrl,
        });
      });
    }
    
    return searchResults;
  }, [searchTerm, filter, t]);

  // Use TanStack Query for search with optimized settings
  const {
    data: results = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: searchQueryKey,
    queryFn: fetchSearchResults,
    enabled: searchTerm.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    placeholderData: keepPreviousData,
    retry: 1, // Reduce retries for performance
    refetchOnWindowFocus: false, // Disable unnecessary refetches
  });

  // Optimized debounced search with cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        setIsOpen(true);
        refetch();
      } else {
        setIsOpen(false);
      }
    }, 300); // Reduced debounce time for better UX
    
    return () => clearTimeout(timer);
  }, [searchTerm, filter, refetch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFilterIcon = () => {
    switch (filter) {
      case 'parts':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getFilterLabel = () => {
    switch (filter) {
      case 'parts':
        return t('filters.parts');
      case 'all':
        return t('filters.all');
      case 'accessories':
        return t('filters.accessories');
      default:
        return t('filters.parts');
    }
  };

  const getResultIcon = (result: SearchResult) => {
    if (result.category) {
      const category = result.category.toLowerCase();
      switch (category) {
        case 'case':
        case 'cover':
        case 'screen_protector':
          return <Shield className="h-4 w-4" />;
        case 'charger':
        case 'power':
        case 'battery':
          return <Battery className="h-4 w-4" />;
        case 'cable':
        case 'adapter':
          return <Cable className="h-4 w-4" />;
        case 'headphones':
        case 'earbuds':
          return <Headphones className="h-4 w-4" />;
        case 'speaker':
          return <Speaker className="h-4 w-4" />;
        case 'camera':
          return <Camera className="h-4 w-4" />;
        default:
          return <Package className="h-4 w-4" />;
      }
    }
    return <Package className="h-4 w-4" />;
  };

  const handleResultClick = (result: SearchResult) => {
    // Track the search when user clicks a result
    if (searchTerm.trim().length >= 2) {
      addSearchHistory(searchTerm.trim());
    }
    
    if (result.type === 'part' && result.id) {
      router.push(`/parts/${result.id.replace(/^part-/, '')}`);
    } else if (result.type === 'accessory' && result.id) {
      router.push(`/accessories/${result.id.replace(/^accessory-/, '')}`);
    } else if (result.url) {
      router.push(result.url);
    } else {
      router.push(`/repairs?search=${encodeURIComponent(searchTerm)}`);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && searchTerm.trim().length >= 2) {
      // Track the search when user presses Enter
      addSearchHistory(searchTerm.trim());
      
      if (results.length > 0) {
        const bestResult = results.reduce((prev, curr) => (curr.matchScore || 0) > (prev.matchScore || 0) ? curr : prev, results[0]);
        if (bestResult.type === 'part') {
          router.push(`/parts/${bestResult.id}`);
          setIsOpen(false);
          return;
        } else if (bestResult.type === 'accessory') {
          router.push(`/accessories/${bestResult.id}`);
          setIsOpen(false);
          return;
        } else if (bestResult.url) {
          router.push(bestResult.url);
          setIsOpen(false);
          return;
        }
      }
      const searchUrl = `${getSmartDestination()}?search=${encodeURIComponent(searchTerm.trim())}`;
      router.push(searchUrl);
      setIsOpen(false);
    }
  };

  // Smart destination logic
  const getSmartDestination = () => {
    if (results.length === 0) return '/repairs';
    
    const partCount = results.filter(r => r.type === 'part').length;
    const accessoryCount = results.filter(r => r.type === 'accessory').length;
    
    if (partCount > accessoryCount) return '/repairs';
    if (accessoryCount > partCount) return '/accessories';
    
    const partResults = results.filter(r => r.type === 'part');
    const accessoryResults = results.filter(r => r.type === 'accessory');
    
    const bestPartScore = partResults.length > 0 ? 
      Math.max(...partResults.map(r => r.matchScore || 0)) : 0;
    const bestAccessoryScore = accessoryResults.length > 0 ? 
      Math.max(...accessoryResults.map(r => r.matchScore || 0)) : 0;
    
    return bestPartScore >= bestAccessoryScore ? '/repairs' : '/accessories';
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative flex items-center">
        {/* Search Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              aria-label='Search filter'
              className="rounded-r-none border-r-0 flex items-center space-x-1 px-2 sm:px-3 min-w-[80px] sm:min-w-[100px] border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            >
              {getFilterIcon()}
              <span className="hidden sm:inline text-xs sm:text-sm">{getFilterLabel()}</span>
              <ChevronDown aria-label='Toggle search filter' className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setFilter('all')}>
              <Package aria-label='All filters' className="h-4 w-4 mr-2" />
              {t('filters.all')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('parts')}>
              <Package aria-label='Parts filter' className="h-4 w-4 mr-2" />
              {t('filters.parts')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('accessories')}>
              <Package aria-label='Accessories filter' className="h-4 w-4 mr-2" />
              {t('filters.accessories')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Input */}
        <div className="relative flex-1">
          <Input
            aria-label='Search input'
            type="text"
            placeholder={t('placeholder')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length >= 2) {
                setIsOpen(true);
              }
            }}
            onFocus={() => {
              if (searchTerm.length >= 2) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            className="rounded-l-none rounded-r-none border-l  border-r text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 border-gray-300 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              onMouseUp={(e) => e.preventDefault()} // Prevent focus loss
              aria-labelledby='Clear search'
              onClick={() => {
                setSearchTerm('');
                setIsOpen(false);
              }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center justify-center rounded-full p-1 z-10"
              aria-label="Clear search"
            >
              <X aria-label='Clear search' className="h-3 w-3 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <Button 
        aria-lzabel='Search button'
          size="sm" 
          className="rounded-l-none px-2 sm:px-3 border-gray-300  text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          onClick={() => {
            if (searchTerm.trim() && searchTerm.length >= 2) {
              const trimmedSearch = searchTerm.trim();
              // Track search history when user clicks search button
              addSearchHistory(trimmedSearch);
              // If user just clicks search, always go to browser page with search term
              const partCount = results.filter(r => r.type === 'part').length;
              const accessoryCount = results.filter(r => r.type === 'accessory').length;
              if (partCount >= accessoryCount) {
                router.push(`/repairs?search=${encodeURIComponent(trimmedSearch)}`);
              } else {
                router.push(`/accessories?search=${encodeURIComponent(trimmedSearch)}`);
              }
              setIsOpen(false);
            }
          }}
        >
          <Search aria-label='Search button' className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (searchTerm.length >= 2 || results.length > 0) && (
        <div role="listbox" className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-40 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div aria-label='Loading results' className="p-4 text-center text-gray-500">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              {t('results.searching')}
            </div>
          ) : searchTerm.length < 2 ? (
            <div className="p-4 text-center text-gray-500">
              <Search aria-label='Search input' className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">{t('results.minCharacters')}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b">
                {t(results.length === 1 ? 'results.found' : 'results.found_plural', { count: results.length })}
              </div>
              {results.map((result) => (
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  aria-label={`Search result for ${result.title}`}
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-3 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {result.imageUrl ? (
                        <FallbackImage

                        src={result.imageUrl}
                        alt={result.title}
                        width={40}
                        height={40}
                          className="h-10 w-10 rounded-md object-cover"
                          fallbackContent={getResultIcon(result)}
                      />
                    ) : (
                        <div aria-label={`Search result for ${result.title}`} className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        {getResultIcon(result)}
                      </div>
                    )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate line-clamp-2 min-h-[2.5rem]">
                          {result.title}
                        </p>
                        <div className="flex flex-col gap-1">
                        <Badge aria-label={`Search result type: ${result.type}`} variant="secondary" className="text-xs flex-shrink-0">
                          {result.type === 'part' ? t('badges.part') : t('badges.accessory')}
                        </Badge>
                        </div>
                      </div>
                      {result.description && (
                        <p about={`Search result description for ${result.title}`} className="text-xs text-gray-500 line-clamp-2 sm:truncate">
                          {result.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400 truncate">
                          {result.category || result.deviceType?.replace('_', ' ')}
                        </span>
                        {result.price && (
                          <span aria-label={`Search result price for ${result.title}`} className="text-sm font-medium text-green-600 flex-shrink-0">
                            {formatCurrency(result.price,'EUR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              
              {/* Enhanced View All Results Link */}
              <div role="region" aria-label="View all results" className="px-3 py-2 border-t bg-gray-50">
                {(() => {
                  const partResults = results.filter(r => r.type === 'part');
                  const accessoryResults = results.filter(r => r.type === 'accessory');
                  
                  if (partResults.length > 0 && accessoryResults.length > 0) {
                    return (
                      <div aria-label='View all parts and accessories results' className="space-y-1">
                        <Link
                         aria-label='View all parts results'
                          href={`/repairs?search=${encodeURIComponent(searchTerm || '')}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium block truncate"
                          onClick={() => {
                            if (searchTerm.trim().length >= 2) {
                              addSearchHistory(searchTerm.trim());
                            }
                            setIsOpen(false);
                          }}
                        >
                          {t(partResults.length === 1 ? 'results.viewParts' : 'results.viewParts_plural', { 
                            count: partResults.length, 
                            query: searchTerm 
                          })}
                        </Link>
                        <Link
                          aria-label='View all accessories results'
                          href={`/accessories?search=${encodeURIComponent(searchTerm || '')}`}
                          className="text-sm text-green-600 hover:text-green-800 font-medium block truncate"
                          onClick={() => {
                            if (searchTerm.trim().length >= 2) {
                              addSearchHistory(searchTerm.trim());
                            }
                            setIsOpen(false);
                          }}
                        >
                          {t(accessoryResults.length === 1 ? 'results.viewAccessories' : 'results.viewAccessories_plural', { 
                            count: accessoryResults.length, 
                            query: searchTerm 
                          })}
                        </Link>
                      </div>
                    );
                  }
                  
                  if (partResults.length > 0) {
                    return (
                      <Link
                          aria-label='View all parts results'
                        href={`/repairs?search=${encodeURIComponent(searchTerm || '')}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium block truncate"
                        onClick={() => {
                          if (searchTerm.trim().length >= 2) {
                            addSearchHistory(searchTerm.trim());
                          }
                          setIsOpen(false);
                        }}
                      >
                        {t(partResults.length === 1 ? 'results.viewParts' : 'results.viewParts_plural', { 
                          count: partResults.length, 
                          query: searchTerm 
                        })}
                      </Link>
                    );
                  }
                  
                  if (accessoryResults.length > 0) {
                    return (
                      <Link
                        aria-label='View all accessories results'
                        href={`/accessories?search=${encodeURIComponent(searchTerm || '')}`}
                        className="text-sm text-green-600 hover:text-green-800 font-medium block truncate"
                        onClick={() => {
                          if (searchTerm.trim().length >= 2) {
                            addSearchHistory(searchTerm.trim());
                          }
                          setIsOpen(false);
                        }}
                      >
                        {t(accessoryResults.length === 1 ? 'results.viewAccessories' : 'results.viewAccessories_plural', { 
                          count: accessoryResults.length, 
                          query: searchTerm 
                        })}
                      </Link>
                    );
                  }
                  
                  return (
                    <Link
                      aria-label='View all results'
                      href={`${getSmartDestination()}?search=${encodeURIComponent(searchTerm || '')}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium block truncate"
                      onClick={() => {
                        if (searchTerm.trim().length >= 2) {
                          addSearchHistory(searchTerm.trim());
                        }
                        setIsOpen(false);
                      }}
                    >
                      {t('results.viewAll', { query: searchTerm })}
                    </Link>
                  );
                })()}
              </div>
            </div>
          ) : searchTerm.trim() && searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <Search aria-label={`Search for ${searchTerm}`} className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">{t('results.noResults', { query: searchTerm })}</p>
              <p className="text-xs text-gray-400 mt-1">{t('results.noResultsHint')}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}