import { useMemo } from 'react';
import { Accessory } from '@/lib/types';
import { AccessoryFilters } from '@/components/accessories-filter-sidebar';

export function useAccessoryFilters(accessories: Accessory[], filters: AccessoryFilters) {
  const filteredAccessories = useMemo(() => {
    return accessories.filter(accessory => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(accessory.category)) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(accessory.brand)) {
        return false;
      }

      // Price range filter
      if (accessory.price < filters.priceRange[0] || accessory.price > filters.priceRange[1]) {
        return false;
      }

      // Stock filter
      if (filters.inStock && accessory.inStock <= 0) {
        return false;
      }

      // Compatibility filter
      if (filters.compatibility.length > 0 && accessory.compatibility) {
        const accessoryCompatibility = accessory.compatibility.split(',').map(c => c.trim());
        const hasMatchingCompatibility = filters.compatibility.some(filterComp => 
          accessoryCompatibility.some(accComp => 
            accComp.toLowerCase().includes(filterComp.toLowerCase()) ||
            filterComp.toLowerCase().includes(accComp.toLowerCase())
          )
        );
        if (!hasMatchingCompatibility) {
          return false;
        }
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = [
          accessory.name,
          accessory.brand,
          accessory.description || '',
          accessory.compatibility || '',
          accessory.category
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [accessories, filters]);

  return filteredAccessories;
}
