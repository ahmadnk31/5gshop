"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

// Helper function to create slug from name and ID
function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
}

type SearchFilter = 'all' | 'parts' | 'accessories';

interface SearchResult {
  id: string;
  title: string;
  name?: string; // Add name field for slug generation
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
  const [isFocused, setIsFocused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Ensure component is mounted (for portal)
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          name: part.name || part.title, // Add name for slug generation
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
          name: acc.name || acc.title, // Add name for slug generation
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
        setIsFocused(false);
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
    
    if (result.type === 'part' && result.id && result.name) {
      // Use slug-based routing for parts
      const slug = createSlug(result.name, result.id);
      router.push(`/parts/${slug}`);
    } else if (result.type === 'accessory' && result.id && result.name) {
      // Use slug-based routing for accessories
      const slug = createSlug(result.name, result.id);
      router.push(`/accessories/${slug}`);
    } else if (result.url) {
      router.push(result.url);
    } else {
      router.push(`/repairs?search=${encodeURIComponent(searchTerm)}`);
    }
    setIsOpen(false);
    setIsFocused(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsFocused(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && searchTerm.trim().length >= 2) {
      // Track the search when user presses Enter
      addSearchHistory(searchTerm.trim());
      
      if (results.length > 0) {
        const bestResult = results.reduce((prev, curr) => (curr.matchScore || 0) > (prev.matchScore || 0) ? curr : prev, results[0]);
        if (bestResult.type === 'part' && bestResult.id && bestResult.name) {
          const slug = createSlug(bestResult.name, bestResult.id);
          router.push(`/parts/${slug}`);
          setIsOpen(false);
          setIsFocused(false);
          return;
        } else if (bestResult.type === 'accessory' && bestResult.id && bestResult.name) {
          const slug = createSlug(bestResult.name, bestResult.id);
          router.push(`/accessories/${slug}`);
          setIsOpen(false);
          setIsFocused(false);
          return;
        } else if (bestResult.url) {
          router.push(bestResult.url);
          setIsOpen(false);
          setIsFocused(false);
          return;
        }
      }
      const searchUrl = `${getSmartDestination()}?search=${encodeURIComponent(searchTerm.trim())}`;
      router.push(searchUrl);
      setIsOpen(false);
      setIsFocused(false);
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
    <>
      {/* Shadow Overlay - Rendered via Portal */}
      {isMounted && isFocused && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 z-[9] transition-opacity duration-200"
          onClick={() => {
            setIsOpen(false);
            setIsFocused(false);
          }}
          aria-hidden="true"
        />,
        document.body
      )}
      
      <div ref={searchRef} className="relative w-full max-w-2xl z-[10000]">
      <div className="relative flex items-center">
        {/* Search Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="lg"
              aria-label='Search filter'
              className="rounded-r-none border-r-0 flex items-center space-x-2 px-4 sm:px-5 min-w-[100px] sm:min-w-[130px] border-2 border-gray-300 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 h-14"
            >
              {getFilterIcon()}
              <span className="hidden sm:inline text-base font-medium">{getFilterLabel()}</span>
              <ChevronDown aria-label='Toggle search filter' className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[180px] z-[10001]">
            <DropdownMenuItem onClick={() => setFilter('all')} className="text-base py-3 cursor-pointer">
              <Package aria-label='All filters' className="h-5 w-5 mr-3" />
              {t('filters.all')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('parts')} className="text-base py-3 cursor-pointer">
              <Package aria-label='Parts filter' className="h-5 w-5 mr-3" />
              {t('filters.parts')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('accessories')} className="text-base py-3 cursor-pointer">
              <Package aria-label='Accessories filter' className="h-5 w-5 mr-3" />
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
              setIsFocused(true);
              if (searchTerm.length >= 2) {
                setIsOpen(true);
              }
            }}
            onBlur={() => {
              // Delay closing to allow clicking on results
              setTimeout(() => {
                if (!searchRef.current?.contains(document.activeElement)) {
                  setIsFocused(false);
                }
              }, 200);
            }}
            onKeyDown={handleKeyDown}
            className="rounded-l-none rounded-r-none border-l border-r text-base h-14 px-4 py-3 border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 focus:border-green-500"
          />
          {searchTerm && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onMouseUp={(e) => e.preventDefault()}
              aria-labelledby='Clear search'
              onClick={() => {
                setSearchTerm('');
                setIsOpen(false);
                setIsFocused(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center justify-center rounded-full p-2 z-10 hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X aria-label='Clear search' className="h-5 w-5 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <Button 
        aria-label='Search button'
          size="lg" 
          className="rounded-l-none px-5 sm:px-6 border-2 border-green-600 bg-green-600 hover:bg-green-700 text-white focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 h-14"
          onClick={() => {
            if (searchTerm.trim() && searchTerm.length >= 2) {
              const trimmedSearch = searchTerm.trim();
              addSearchHistory(trimmedSearch);
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
          <Search aria-label='Search button' className="h-5 w-5" />
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (searchTerm.length >= 2 || results.length > 0) && (
        <div role="listbox" className="absolute top-full left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-2xl z-[9999] max-h-[32rem] overflow-y-auto w-full sm:w-[600px] md:w-[700px] lg:w-[800px]">
          {isLoading ? (
            <div aria-label='Loading results' className="p-6 text-center text-gray-500">
              <div className="animate-spin h-8 w-8 border-3 border-green-600 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-base font-medium">{t('results.searching')}</p>
            </div>
          ) : searchTerm.length < 2 ? (
            <div className="p-6 text-center text-gray-500">
              <Search aria-label='Search input' className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-base">{t('results.minCharacters')}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wide border-b-2 bg-gray-50">
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
                  className="w-full px-4 py-4 text-left hover:bg-green-50 border-b last:border-b-0 focus:bg-green-50 focus:outline-none transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-gray-100">
                    {result.imageUrl ? (
                        <FallbackImage
                        src={result.imageUrl}
                        alt={result.title}
                        width={64}
                        height={64}
                          className="h-16 w-16 rounded-lg object-cover"
                          fallbackContent={getResultIcon(result)}
                      />
                    ) : (
                        <div aria-label={`Search result for ${result.title}`} className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getResultIcon(result)}
                      </div>
                    )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="text-base font-semibold text-gray-900 truncate line-clamp-2">
                          {result.title}
                        </p>
                        <div className="flex flex-col gap-1">
                        <Badge aria-label={`Search result type: ${result.type}`} variant="secondary" className="text-sm px-2 py-1 flex-shrink-0 font-medium">
                          {result.type === 'part' ? t('badges.part') : t('badges.accessory')}
                        </Badge>
                        </div>
                      </div>
                      {result.description && (
                        <p about={`Search result description for ${result.title}`} className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {result.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500 truncate font-medium">
                          {result.category || result.deviceType?.replace('_', ' ')}
                        </span>
                        {result.price && (
                          <span aria-label={`Search result price for ${result.title}`} className="text-lg font-bold text-green-600 flex-shrink-0">
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
    </>
  );
}