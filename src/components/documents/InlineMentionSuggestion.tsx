
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search for suggestions based on query - now searches all entity types at once
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        // If there's no query, show a list of entity types
        if (!query) {
          setSuggestions([
            { id: 'task', label: 'Task', type: 'task' },
            { id: 'event', label: 'Event', type: 'event' },
            { id: 'document', label: 'Document', type: 'document' },
            { id: 'user', label: 'User', type: 'user' }
          ]);
          return;
        }
        
        // Search all entity types at once
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
    estimateSize: () => 40,
    overscan: 5,
  });
  
  if (!position) return null;
  
  if (isLoading) {
    return (
      <div
        ref={containerRef}
        className="absolute z-10 min-w-[200px] max-w-[300px] p-2 bg-white border border-gray-200 shadow-lg rounded-md mention-suggestion-active"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className="p-2 text-sm text-gray-500">Loading suggestions...</div>
      </div>
    );
  }
  
  if (suggestions.length === 0) {
    return (
      <div
        ref={containerRef}
        className="absolute z-10 min-w-[200px] max-w-[300px] p-2 bg-white border border-gray-200 shadow-lg rounded-md mention-suggestion-active"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className="p-2 text-sm text-gray-500">No results found</div>
      </div>
    );
  }
  
  const getMentionIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'document':
        return <File className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <div
      ref={containerRef}
      className="absolute z-10 min-w-[200px] max-w-[300px] max-h-[300px] overflow-auto bg-white border border-gray-200 shadow-lg rounded-md mention-suggestion-active"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        height: suggestions.length > 7 ? '300px' : 'auto'
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
              className={`absolute top-0 left-0 w-full p-2 cursor-pointer flex items-center ${
                virtualRow.index === selectedIndex ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
              }`}
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`
              }}
              onClick={() => onSelect(item)}
            >
              <span className="mr-2">{getMentionIcon(item.type)}</span>
              <span className="truncate">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
