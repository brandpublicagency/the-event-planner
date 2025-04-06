
import React, { useState, useEffect } from 'react';
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
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length);
        return true;
      }
      
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % items.length);
        return true;
      }
      
      if (event.key === 'Enter' || event.key === 'Tab') {
        command(items[selectedIndex]);
        return true;
      }
      
      return false;
    };
    
    if (editor.isFocused) {
      editor.view.dom.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      editor.view.dom.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, items, selectedIndex, command]);
  
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
    <div className="mention-dropdown-container">
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
