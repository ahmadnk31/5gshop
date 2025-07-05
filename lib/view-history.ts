// Utility functions for managing recently viewed items and search history

export interface RecentlyViewedItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  type: 'part' | 'accessory';
  category?: string;
  url: string;
  viewedAt: number;
}

const MAX_RECENT_ITEMS = 20;
const MAX_SEARCH_HISTORY = 50;

// Recently Viewed Items
export const addRecentlyViewed = (item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem('recentlyViewed');
    const items: RecentlyViewedItem[] = stored ? JSON.parse(stored) : [];
    
    // Remove if already exists
    const filtered = items.filter(existing => existing.id !== item.id);
    
    // Add new item at the beginning
    const newItem: RecentlyViewedItem = {
      ...item,
      viewedAt: Date.now()
    };
    
    const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding recently viewed item:', error);
  }
};

export const getRecentlyViewed = (): RecentlyViewedItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('recentlyViewed');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting recently viewed items:', error);
    return [];
  }
};

export const clearRecentlyViewed = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('recentlyViewed');
};

// Search History
export const addSearchHistory = (searchTerm: string) => {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem('searchHistory');
    const history: string[] = stored ? JSON.parse(stored) : [];
    
    // Remove if already exists and add to beginning
    const filtered = history.filter(term => term.toLowerCase() !== searchTerm.toLowerCase());
    const updated = [searchTerm, ...filtered].slice(0, MAX_SEARCH_HISTORY);
    
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding search history:', error);
  }
};

export const getSearchHistory = (): string[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('searchHistory');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

export const clearSearchHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('searchHistory');
};

// Clear all history
export const clearAllHistory = () => {
  clearRecentlyViewed();
  clearSearchHistory();
}; 