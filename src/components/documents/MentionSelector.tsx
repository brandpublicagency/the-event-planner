
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Calendar, CheckSquare, File, Search, User } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Portal } from '@/components/ui/portal';
import { MentionCategory } from '@/hooks/useMentionItems';

interface MentionItem {
  id: string;
  label: string;
  type: 'event' | 'task' | 'document' | 'user';
}

interface MentionSelectorProps {
  items: MentionItem[];
  command: (item: MentionItem) => void;
  query: string;
  clientRect: DOMRect | null;
  loading: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onCategorySelect?: (category: MentionCategory) => void;
  category: MentionCategory;
}

export const MentionSelector = forwardRef<HTMLDivElement, MentionSelectorProps>(({
  items, 
  command, 
  query,
  clientRect,
  loading,
  selectedIndex,
  setSelectedIndex,
  onCategorySelect,
  category
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
  
  // Reset selectedIndex when items change
  useEffect(() => {
    // Only reset if the selected index is out of bounds
    if (selectedIndex >= items.length) {
      setSelectedIndex(0);
    }
  }, [items, selectedIndex, setSelectedIndex]);
  
  // Handle mouse click
  const handleItemClick = (item: MentionItem) => {
    // Check if this is a category selection
    if (item.id.startsWith('category-') && onCategorySelect) {
      onCategorySelect(item.type as MentionCategory);
    } else {
      command(item);
    }
  };
  
  // Prevent the dropdown from closing on mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  
  // Scroll selected item into view
  useEffect(() => {
    if (ref && 'current' in ref && ref.current && items.length > 0) {
      const selectedElement = ref.current.querySelector(`[data-selected="true"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, items, ref]);
  
  if (!clientRect || !mounted) return null;
  
  // Calculate position based on client rect
  const position = {
    top: clientRect.top + clientRect.height,
    left: clientRect.left,
  };
  
  const getTypeIcon = (type: 'event' | 'task' | 'document' | 'user') => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'task':
        return <CheckSquare className="h-4 w-4 text-amber-500" />;
      case 'document':
        return <File className="h-4 w-4 text-emerald-500" />;
      case 'user':
        return <User className="h-4 w-4 text-purple-500" />;
    }
  };
  
  // Get label for category in header
  const getCategoryLabel = (cat: MentionCategory): string => {
    switch (cat) {
      case 'event': return '/e - Events';
      case 'task': return '/t - Tasks';
      case 'document': return '/d - Documents';
      case 'user': return '/u - Users';
      default: return 'Select a category';
    }
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
            <span className="ml-2 text-sm">Loading...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-zinc-500">
            <Search className="h-5 w-5" />
            <p className="mt-1 text-sm">No results found</p>
            {query && <p className="text-xs text-zinc-400">Try a different search term</p>}
          </div>
        ) : (
          <div>
            {/* Category header showing current shortcut */}
            <div className="px-2 py-1 text-xs font-medium text-zinc-500 bg-zinc-100 flex items-center justify-between">
              <span>{getCategoryLabel(category)}</span>
              {category && (
                <span className="text-xs text-zinc-400">
                  Press ↑↓ to navigate, Enter to select
                </span>
              )}
            </div>
            
            {items.map((item, index) => {
              const isSelected = index === selectedIndex;
              
              return (
                <button
                  key={`${item.type}-${item.id}`}
                  className={`w-full flex items-center px-2 py-1.5 text-sm ${
                    isSelected ? 'bg-zinc-100 font-medium' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={() => setSelectedIndex(index)}
                  data-selected={isSelected ? "true" : "false"}
                >
                  <span className="mr-2">{getTypeIcon(item.type)}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Portal>
  );
});

MentionSelector.displayName = 'MentionSelector';
