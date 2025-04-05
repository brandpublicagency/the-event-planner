
import { useState, useEffect } from 'react';
import { MentionItem } from '../MentionSelector';

interface MentionSuggestionSearchProps {
  query: string;
  position: { top: number; left: number } | null;
  searchAllEntities: (query: string) => Promise<MentionItem[]>;
}

export function useMentionSuggestionSearch({
  query,
  position,
  searchAllEntities
}: MentionSuggestionSearchProps) {
  const [suggestions, setSuggestions] = useState<MentionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // When the query changes, update the suggestions
  useEffect(() => {
    if (!position) return;
    
    // Don't search until the user has typed something
    if (query === '') {
      setIsLoading(false);
      setSuggestions([]);
      setError(null);
      return;
    }
    
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    
    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(async () => {
      try {
        console.log('Searching for mentions with query:', query);
        const results = await searchAllEntities(query);
        
        if (isMounted) {
          setSuggestions(results);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error searching for mentions:', err);
        if (isMounted) {
          setError('Failed to load suggestions');
          setSuggestions([]);
          setIsLoading(false);
        }
      }
    }, 300);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [query, position, searchAllEntities]);
  
  return { suggestions, isLoading, error };
}
