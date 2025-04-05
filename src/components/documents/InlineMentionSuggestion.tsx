
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, CheckSquare, File, User } from 'lucide-react';
import { MentionItem } from './MentionSelector';
import { useVirtualizer } from '@tanstack/react-virtual';

interface InlineMentionSuggestionsProps {
  query: string;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
  position: { top: number; left: number } | null;
  searchAllEntities: (query: string) => Promise<MentionItem[]>;
}

export const InlineMentionSuggestions = ({
  query,
  onSelect,
  onClose,
  position,
  searchAllEntities
}: InlineMentionSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<MentionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Search for suggestions based on query
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const results = await searchAllEntities(query);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [query, searchAllEntities]);
  
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!suggestions.length) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
          
        case 'Enter':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
          
        case 'Tab':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
          
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [suggestions, selectedIndex, onSelect, onClose]);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const rowVirtualizer = useVirtualizer({
    count: suggestions.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 24, // Smaller row height for inline suggestions
    overscan: 5,
  });
  
  if (!position) return null;
  
  const getMentionIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-3 w-3" />;
      case 'task':
        return <CheckSquare className="h-3 w-3" />;
      case 'document':
        return <File className="h-3 w-3" />;
      case 'user':
        return <User className="h-3 w-3" />;
      default:
        return null;
    }
  };
  
  // Render suggestions inline with the text
  return (
    <div
      ref={containerRef}
      className="absolute z-10 max-w-[300px] inline-flex flex-col bg-transparent mention-suggestion-active"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {isLoading ? (
        <div className="text-xs text-gray-500 bg-white bg-opacity-90 px-2 py-1 rounded-md shadow-sm border border-gray-200">
          Loading...
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-xs text-gray-500 bg-white bg-opacity-90 px-2 py-1 rounded-md shadow-sm border border-gray-200">
          No results
        </div>
      ) : (
        <div 
          className="inline-flex flex-col max-h-[120px] overflow-auto bg-white bg-opacity-90 rounded-md shadow-sm border border-gray-200" 
          style={{
            width: 'auto',
            height: suggestions.length > 5 ? '120px' : 'auto'
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative'
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const item = suggestions[virtualRow.index];
              return (
                <div
                  key={virtualRow.index}
                  className={`absolute top-0 left-0 w-full text-xs flex items-center cursor-pointer px-2 py-1 ${
                    virtualRow.index === selectedIndex ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                  }`}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                  onClick={() => onSelect(item)}
                >
                  <span className="mr-1">{getMentionIcon(item.type)}</span>
                  <span className="truncate">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
