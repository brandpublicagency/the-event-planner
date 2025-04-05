
import React, { useState, useEffect, useRef, useMemo, forwardRef } from 'react';
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
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

export const MentionSelector = forwardRef<HTMLDivElement, MentionSelectorProps>(({
  items, 
  command, 
  query,
  clientRect,
  loading,
  selectedIndex,
  setSelectedIndex
}, ref) => {
  // State to track if the component has been mounted
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state on component mount
  useEffect(() => {
    setMounted(true);
    
    // Event handler for clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && 'current' in ref && ref.current && !ref.current.contains(event.target as Node)) {
        // Let the user click outside if they want to close the dropdown
        // This intentionally doesn't close the dropdown - we let the editor handle this
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Handle mouse click
  const handleItemClick = (item: MentionItem) => {
    command(item);
  };
  
  // Prevent the dropdown from closing on mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  
  // Scroll selected item into view
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      const selectedElement = ref.current.querySelector(`[data-selected="true"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, ref]);
  
  if (!clientRect || !mounted) return null;
  
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
          onClick={() => handleItemClick(item)}
          onMouseDown={handleMouseDown}
          onMouseEnter={() => setSelectedIndex(startIndex + index)}
          data-selected={isSelected ? "true" : "false"}
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
        ref={ref}
        className="absolute z-50 bg-white border border-zinc-200 rounded-md shadow-md w-64 max-h-72 overflow-y-auto"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onMouseDown={handleMouseDown}
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
});

MentionSelector.displayName = 'MentionSelector';
