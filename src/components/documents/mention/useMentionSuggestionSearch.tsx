
import { useState, useEffect } from 'react';
import { MentionItem } from '../MentionSelector';

interface UseMentionSuggestionSearchProps {
  query: string;
  position: { top: number; left: number } | null;
  searchAllEntities: (query: string) => Promise<MentionItem[]>;
}

export const useMentionSuggestionSearch = ({
  query,
  position,
  searchAllEntities
}: UseMentionSuggestionSearchProps) => {
  const [suggestions, setSuggestions] = useState<MentionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const results = await searchAllEntities(query);
        setSuggestions(results || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Failed to load suggestions');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if we have a position (i.e., the suggestion is active)
    if (position) {
      const timeoutId = setTimeout(() => {
        fetchSuggestions();
      }, 50); // Small delay to prevent too many simultaneous requests
      
      return () => clearTimeout(timeoutId);
    }
  }, [query, searchAllEntities, position]);
  
  return { suggestions, isLoading, error };
};
