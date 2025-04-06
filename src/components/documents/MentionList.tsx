
import React, { useState, useEffect, useRef } from 'react';
import { FileIcon, CalendarDaysIcon, ClipboardListIcon, UserIcon } from 'lucide-react';

interface MentionItem {
  id: string;
  title: string;
  type: 'document' | 'task' | 'event' | 'user' | 'header';
  url?: string;
  isHeader?: boolean;
}

interface MentionListProps {
  items: MentionItem[];
  command: (item: MentionItem) => void;
  editor: any;
}

const MentionList: React.FC<MentionListProps> = ({ items, command, editor }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectItem = (index: number) => {
    // Filter out header items when selecting
    const selectableItems = items.filter(item => !item.isHeader);
    
    if (selectableItems.length > 0) {
      // Find the actual index in the original items array
      const actualItem = selectableItems[index % selectableItems.length];
      const actualIndex = items.findIndex(item => item.id === actualItem.id);
      setSelectedIndex(actualIndex);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Filter out header items for navigation
      const selectableItems = items.filter(item => !item.isHeader);
      if (!selectableItems.length) return false;
      
      // Find current index within selectable items
      const currentItem = items[selectedIndex];
      const currentSelectableIndex = selectableItems.findIndex(item => 
        item.id === currentItem?.id);
      
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        // Move to previous selectable item
        const newIndex = currentSelectableIndex > 0 
          ? currentSelectableIndex - 1 
          : selectableItems.length - 1;
        
        selectItem(newIndex);
        return true;
      }
      
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        // Move to next selectable item
        const newIndex = (currentSelectableIndex + 1) % selectableItems.length;
        selectItem(newIndex);
        return true;
      }
      
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        command(items[selectedIndex]);
        return true;
      }
      
      return false;
    };
    
    // Add event listener to document to catch all keydown events
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [items, selectedIndex, command]);
  
  // Scroll selected item into view
  useEffect(() => {
    if (containerRef.current && selectedIndex >= 0) {
      const selectedElement = containerRef.current.querySelector(`.tribute-item.highlight`);
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);
  
  // Initialize with first non-header item selected
  useEffect(() => {
    const firstSelectableIndex = items.findIndex(item => !item.isHeader);
    if (firstSelectableIndex >= 0) {
      setSelectedIndex(firstSelectableIndex);
    }
  }, [items]);
  
  // Group items by type
  const groupedItems = items.reduce<Record<string, MentionItem[]>>((acc, item) => {
    if (item.isHeader) {
      return acc;
    }
    
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    
    acc[item.type].push(item);
    return acc;
  }, {});
  
  // If no items, show loading or no results
  if (items.length === 0) {
    return (
      <div className="mention-dropdown-container">
        <div className="tribute-item tribute-item-loading">
          <div className="loading-spinner"></div>
          <span>No results found</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mention-dropdown-container" ref={containerRef}>
      {Object.entries(groupedItems).map(([type, groupItems]) => (
        <React.Fragment key={type}>
          <div className="tribute-header">
            <span className="mention-header-title">
              {type === 'document' ? 'Documents' : 
               type === 'task' ? 'Tasks' : 
               type === 'event' ? 'Events' : 'Users'}
            </span>
          </div>
          
          {groupItems.map((item) => {
            const isSelected = items.indexOf(item) === selectedIndex;
            
            return (
              <button
                key={item.id}
                className={`tribute-item tribute-item-${item.type} ${isSelected ? 'highlight' : ''}`}
                onClick={() => command(item)}
                onMouseEnter={() => setSelectedIndex(items.indexOf(item))}
              >
                <span className="mention-icon">
                  {item.type === 'document' ? <FileIcon className="h-4 w-4" /> : 
                   item.type === 'task' ? <ClipboardListIcon className="h-4 w-4" /> : 
                   item.type === 'event' ? <CalendarDaysIcon className="h-4 w-4" /> : 
                   <UserIcon className="h-4 w-4" />}
                </span>
                <div className="mention-info">
                  <span className="mention-title">{item.title}</span>
                </div>
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MentionList;
