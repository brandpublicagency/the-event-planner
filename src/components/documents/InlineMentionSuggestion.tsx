
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, CheckSquare, File, User } from 'lucide-react';
import { MentionItem } from './MentionSelector';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

interface InlineMentionSuggestionsProps {
  query: string;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
  position: { top: number; left: number } | null;
  mentionType: string | null;
}

export const InlineMentionSuggestions = ({
  query,
  onSelect,
  onClose,
  position,
  mentionType
}: InlineMentionSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<MentionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Search for suggestions based on type and query
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // Default items if no specific type
        if (!mentionType) {
          setSuggestions([
            { id: 'task', label: 'Task', type: 'task' },
            { id: 'event', label: 'Event', type: 'event' },
            { id: 'document', label: 'Document', type: 'document' },
            { id: 'user', label: 'User', type: 'user' }
          ]);
          return;
        }
        
        // Search based on the mention type
        switch (mentionType) {
          case 'task':
            const { data: tasks } = await supabase
              .from('tasks')
              .select('id, title')
              .ilike('title', `%${query}%`)
              .limit(10);
            
            setSuggestions(
              tasks?.map(task => ({
                id: task.id,
                label: task.title,
                type: 'task'
              })) || []
            );
            break;
            
          case 'event':
            const { data: events } = await supabase
              .from('events')
              .select('event_code, name')
              .ilike('name', `%${query}%`)
              .limit(10);
            
            setSuggestions(
              events?.map(event => ({
                id: event.event_code,
                label: event.name,
                type: 'event'
              })) || []
            );
            break;
            
          case 'document':
            const { data: documents } = await supabase
              .from('documents')
              .select('id, title')
              .ilike('title', `%${query}%`)
              .limit(10);
            
            setSuggestions(
              documents?.map(doc => ({
                id: doc.id,
                label: doc.title,
                type: 'document'
              })) || []
            );
            break;
            
          case 'user':
            const { data: users } = await supabase
              .from('profiles')
              .select('id, full_name')
              .ilike('full_name', `%${query}%`)
              .limit(10);
            
            setSuggestions(
              users?.map(user => ({
                id: user.id,
                label: user.full_name,
                type: 'user'
              })) || []
            );
            break;
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    
    fetchSuggestions();
  }, [query, mentionType]);
  
  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);
  
  // Handle keyboard navigation
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
  
  // Handle clicks outside
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
  
  // Setup virtualizer for performance with many items
  const rowVirtualizer = useVirtualizer({
    count: suggestions.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });
  
  // If no position, don't render
  if (!position) return null;
  
  // If no suggestions, show a message
  if (suggestions.length === 0) {
    return (
      <div
        ref={containerRef}
        className="absolute z-10 min-w-[200px] max-w-[300px] max-h-[300px] overflow-auto bg-white border border-gray-200 shadow-lg rounded-md"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className="p-2 text-sm text-gray-500">No results found</div>
      </div>
    );
  }
  
  // Get the icon for a mention type
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
      className="absolute z-10 min-w-[200px] max-w-[300px] max-h-[300px] overflow-auto bg-white border border-gray-200 shadow-lg rounded-md"
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
