'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Accessory, RepairService, Part } from '@/lib/types'

// ===========================
// ACCESSORIES QUERIES
// ===========================

export function useAccessories() {
  return useQuery({
    queryKey: ['accessories'],
    queryFn: async () => {
      const response = await fetch('/api/accessories')
      if (!response.ok) throw new Error('Failed to fetch accessories')
      return response.json() as Promise<Accessory[]>
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAccessory(id: string) {
  return useQuery({
    queryKey: ['accessories', id],
    queryFn: async () => {
      const response = await fetch(`/api/accessories/${id}`)
      if (!response.ok) throw new Error('Failed to fetch accessory')
      return response.json() as Promise<Accessory>
    },
    enabled: !!id, // Only run if ID exists
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useFeaturedAccessories(limit: number = 6) {
  return useQuery({
    queryKey: ['accessories', 'featured', limit],
    queryFn: async () => {
      const response = await fetch(`/api/accessories/featured?limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch featured accessories')
      return response.json() as Promise<Accessory[]>
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ===========================
// REPAIR SERVICES QUERIES
// ===========================

export function useRepairServices() {
  return useQuery({
    queryKey: ['repair-services'],
    queryFn: async () => {
      const response = await fetch('/api/repair-services')
      if (!response.ok) throw new Error('Failed to fetch repair services')
      return response.json() as Promise<RepairService[]>
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function usePopularServices(limit: number = 3) {
  return useQuery({
    queryKey: ['repair-services', 'popular', limit],
    queryFn: async () => {
      const response = await fetch(`/api/repair-services/popular?limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch popular services')
      return response.json() as Promise<RepairService[]>
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ===========================
// PARTS QUERIES
// ===========================

export function useParts() {
  return useQuery({
    queryKey: ['parts'],
    queryFn: async () => {
      const response = await fetch('/api/parts')
      if (!response.ok) throw new Error('Failed to fetch parts')
      return response.json() as Promise<Part[]>
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function usePart(id: string) {
  return useQuery({
    queryKey: ['parts', id],
    queryFn: async () => {
      const response = await fetch(`/api/parts/${id}`)
      if (!response.ok) throw new Error('Failed to fetch part')
      return response.json() as Promise<Part>
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export function useHomepageParts() {
  return useQuery({
    queryKey: ['parts', 'homepage'],
    queryFn: async () => {
      const response = await fetch('/api/parts/homepage')
      if (!response.ok) throw new Error('Failed to fetch homepage parts')
      return response.json() as Promise<Part[]>
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ===========================
// DEVICES QUERIES
// ===========================

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await fetch('/api/devices')
      if (!response.ok) throw new Error('Failed to fetch devices')
      return response.json()
    },
    staleTime: 10 * 60 * 1000, // Devices change less frequently
    gcTime: 15 * 60 * 1000,
  })
}

export function useDeviceTypes() {
  return useQuery({
    queryKey: ['device-types'],
    queryFn: async () => {
      const response = await fetch('/api/devices/types')
      if (!response.ok) throw new Error('Failed to fetch device types')
      return response.json()
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

// ===========================
// MUTATIONS (for updates)
// ===========================

export function useCreateAccessory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<Accessory>) => {
      const response = await fetch('/api/accessories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create accessory')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch accessories
      queryClient.invalidateQueries({ queryKey: ['accessories'] })
    },
  })
}

export function useUpdateAccessory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Accessory> }) => {
      const response = await fetch(`/api/accessories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update accessory')
      return response.json()
    },
    onSuccess: (_, variables) => {
      // Invalidate specific accessory and list
      queryClient.invalidateQueries({ queryKey: ['accessories', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['accessories'] })
    },
  })
}

export function useDeleteAccessory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/accessories/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete accessory')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] })
    },
  })
}

// ===========================
// DEVICE CATALOG QUERIES
// ===========================

export function useBrandsByType(deviceType: string | null) {
  return useQuery({
    queryKey: ['brands', deviceType],
    queryFn: async () => {
      const response = await fetch(`/api/devices/brands?type=${deviceType}`)
      if (!response.ok) throw new Error('Failed to fetch brands')
      return response.json() as Promise<string[]>
    },
    enabled: !!deviceType,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

export function useModelsByBrand(deviceType: string | null, brand: string | null) {
  return useQuery({
    queryKey: ['models', deviceType, brand],
    queryFn: async () => {
      const response = await fetch(`/api/devices/models?type=${deviceType}&brand=${brand}`)
      if (!response.ok) throw new Error('Failed to fetch models')
      return response.json() as Promise<string[]>
    },
    enabled: !!deviceType && !!brand,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

export function usePartsByDeviceModel(deviceType: string | null, brand: string | null, model: string | null) {
  return useQuery({
    queryKey: ['parts-by-device', deviceType, brand, model],
    queryFn: async () => {
      const response = await fetch(`/api/devices/parts?type=${deviceType}&brand=${brand}&model=${model}`)
      if (!response.ok) throw new Error('Failed to fetch parts')
      return response.json()
    },
    enabled: !!deviceType && !!model,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook to get brands with counts and images for a device type (for repairs page)
export function useBrandsWithDetails(
  deviceType: string | null, 
  options?: { 
    initialData?: { brand: string; count: number; imageUrl?: string }[]
    enabled?: boolean 
  }
) {
  return useQuery({
    queryKey: ['brands-details', deviceType],
    queryFn: async () => {
      const response = await fetch(`/api/repairs/brands?type=${deviceType}`)
      if (!response.ok) throw new Error('Failed to fetch brand details')
      return response.json() as Promise<{ brand: string; count: number; imageUrl?: string }[]>
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!deviceType,
    initialData: options?.initialData,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

// Hook to get device models for a specific brand and type
export function useDeviceModels(deviceType: string | null, brand: string | null) {
  return useQuery({
    queryKey: ['device-models', deviceType, brand],
    queryFn: async () => {
      const response = await fetch(`/api/repairs/models?type=${deviceType}&brand=${brand}`)
      if (!response.ok) throw new Error('Failed to fetch device models')
      return response.json()
    },
    enabled: !!deviceType && !!brand,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

// Hook to get a specific device with parts and services
export function useDeviceDetails(deviceType: string | null, brand: string | null, model: string | null) {
  return useQuery({
    queryKey: ['device-details', deviceType, brand, model],
    queryFn: async () => {
      const response = await fetch(`/api/repairs/device?type=${deviceType}&brand=${brand}&model=${model}`)
      if (!response.ok) throw new Error('Failed to fetch device details')
      return response.json()
    },
    enabled: !!deviceType && !!brand && !!model,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// ===========================
// CAROUSEL QUERIES
// ===========================

export function useCarouselItems(locale: string = 'nl') {
  return useQuery({
    queryKey: ['carousel', locale],
    queryFn: async () => {
      const response = await fetch(`/api/carousel?locale=${locale}`)
      if (!response.ok) throw new Error('Failed to fetch carousel items')
      return response.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - carousel rarely changes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

// ===========================
// PREFETCH UTILITIES
// ===========================

export function usePrefetchAccessories() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['accessories'],
      queryFn: async () => {
        const response = await fetch('/api/accessories')
        if (!response.ok) throw new Error('Failed to fetch accessories')
        return response.json()
      },
    })
  }
}

export function usePrefetchRepairServices() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['repair-services'],
      queryFn: async () => {
        const response = await fetch('/api/repair-services')
        if (!response.ok) throw new Error('Failed to fetch repair services')
        return response.json()
      },
    })
  }
}
