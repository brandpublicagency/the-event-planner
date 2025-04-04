
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Calendar, CheckSquare, File, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Portal } from '@/components/ui/portal';

interface MentionItem {
  id: string;
  label: string;
  type: 'event' | 'task' | 'document';
}

interface MentionSelectorProps {
  items: MentionItem[];
  command: (item: MentionItem) => void;
  query: string;
  clientRect: DOMRect | null;
  loading: boolean;
}

export const MentionSelector: React.FC<MentionSelectorProps> = ({
  items, 
  command, 
  query,
  clientRect,
  loading
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectorRef = useRef<HTMLDivElement>(null);
  
  // Filter the items based on the query
  const filteredItems = useMemo(() => {
    if (!query) return items;
    
    const lowerCaseQuery = query.toLowerCase();
    return items.filter(item => 
      item.label.toLowerCase().includes(lowerCaseQuery)
    );
  }, [items, query]);
  
  // Group items by type
  const groupedItems = useMemo(() => {
    const grouped = {
      event: [] as MentionItem[],
      task: [] as MentionItem[],
      document: [] as MentionItem[]
    };
    
    filteredItems.forEach(item => {
      grouped[item.type].push(item);
    });
    
    return grouped;
  }, [filteredItems]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((selectedIndex + 1) % filteredItems.length);
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((selectedIndex - 1 + filteredItems.length) % filteredItems.length);
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          command(filteredItems[selectedIndex]);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, filteredItems, command]);
  
  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);
  
  if (!clientRect) return null;
  
  const position = {
    top: clientRect.top + clientRect.height,
    left: clientRect.left,
  };
  
  const getTypeIcon = (type: 'event' | 'task' | 'document') => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'task':
        return <CheckSquare className="h-4 w-4 text-amber-500" />;
      case 'document':
        return <File className="h-4 w-4 text-emerald-500" />;
    }
  };
  
  const renderSectionTitle = (title: string, count: number) => {
    if (count === 0) return null;
    
    return (
      <div className="px-2 py-1 text-xs font-medium text-zinc-500 bg-zinc-100">
        {title} ({count})
      </div>
    );
  };
  
  const renderItems = (items: MentionItem[], startIndex: number) => {
    if (items.length === 0) return null;
    
    return items.map((item, index) => {
      const isSelected = startIndex + index === selectedIndex;
      
      return (
        <button
          key={`${item.type}-${item.id}`}
          className={`w-full flex items-center px-2 py-1.5 text-sm ${
            isSelected ? 'bg-zinc-100' : ''
          }`}
          onClick={() => command(item)}
          onMouseEnter={() => setSelectedIndex(startIndex + index)}
        >
          <span className="mr-2">{getTypeIcon(item.type)}</span>
          <span className="truncate">{item.label}</span>
        </button>
      );
    });
  };
  
  return (
    <Portal>
      <div
        ref={selectorRef}
        className="absolute z-50 bg-white border border-zinc-200 rounded-md shadow-md w-64 max-h-72 overflow-y-auto"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            <span className="ml-2 text-sm text-zinc-600">Loading...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-zinc-500">
            <Search className="h-5 w-5" />
            <p className="mt-1 text-sm">No results for "{query}"</p>
          </div>
        ) : (
          <>
            {/* Events section */}
            {renderSectionTitle('Events', groupedItems.event.length)}
            {renderItems(groupedItems.event, 0)}
            
            {/* Tasks section */}
            {renderSectionTitle('Tasks', groupedItems.task.length)}
            {renderItems(groupedItems.task, groupedItems.event.length)}
            
            {/* Documents section */}
            {renderSectionTitle('Documents', groupedItems.document.length)}
            {renderItems(
              groupedItems.document, 
              groupedItems.event.length + groupedItems.task.length
            )}
          </>
        )}
      </div>
    </Portal>
  );
};
