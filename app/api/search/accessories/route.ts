import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    // Get all accessories and search through them
    const accessories = await DatabaseService.getAllAccessoriesSimple();
    const searchResults: any[] = [];

    accessories.forEach(accessory => {
      const searchTerm = query.toLowerCase();
      const accessoryName = accessory.name.toLowerCase();
      const accessoryDescription = accessory.description?.toLowerCase() || '';
      const accessoryCategory = accessory.category.toLowerCase();

      // Improved matching logic with priority scoring
      const searchTermLower = searchTerm.toLowerCase();

      // Exact match gets highest priority
      const isExactMatch = accessoryName === searchTermLower ||
                           accessoryCategory === searchTermLower;

      // Word boundary match
      const isWordBoundaryMatch = (term: string) => {
        if (!term) return false;
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordBoundaryRegex = new RegExp(`\\b${escapedTerm}\\b`, 'i');
        return wordBoundaryRegex.test(accessoryName) ||
               wordBoundaryRegex.test(accessoryDescription) ||
               wordBoundaryRegex.test(accessoryCategory);
      };

      // Starts with match
      const isStartsWithMatch = accessoryName.startsWith(searchTermLower) ||
                               accessoryCategory.startsWith(searchTermLower);

      // Contains match (lowest priority)
      const isContainsMatch = accessoryName.includes(searchTermLower) ||
                             accessoryDescription.includes(searchTermLower) ||
                             accessoryCategory.includes(searchTermLower);

      // Apply matching logic with priority scoring
      let matchScore = 0;
      if (isExactMatch) matchScore = 100;
      else if (isWordBoundaryMatch(searchTermLower)) matchScore = 80;
      else if (isStartsWithMatch) matchScore = 60;
      else if (isContainsMatch) matchScore = 40;

      if (matchScore > 0) {
        searchResults.push({
          id: `accessory-${accessory.id}`, // Prefix to avoid ID conflicts
          name: accessory.name,
          title: accessory.name,
          description: accessory.description,
          price: accessory.price,
          category: accessory.category,
          type: 'accessory', // Make sure this is 'accessory'
          imageUrl: accessory.imageUrl,
          compatibility: accessory.compatibility,
          url: `/accessories/${accessory.id}`, // Correct URL for accessories
          matchScore: matchScore
        });
      }
    });

    // Sort by match score (highest first), then limit results
    const sortedResults = searchResults.sort((a, b) => {
      const scoreA = a.matchScore || 0;
      const scoreB = b.matchScore || 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Higher score first
      }
      return a.name.localeCompare(b.name); // Alphabetical if same score
    });
        
    // Limit results to prevent overwhelming the UI
    const limitedResults = sortedResults.slice(0, 10);

    return NextResponse.json(limitedResults);
  } catch (error) {
    console.error('Search accessories error:', error);
    return NextResponse.json([]);
  }
}