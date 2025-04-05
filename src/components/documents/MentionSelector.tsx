
import React, { forwardRef, useEffect } from 'react';
import { Calendar, CheckSquare, File, User } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface MentionItem {
  id: string;
  label: string;
  type: 'event' | 'task' | 'document' | 'user';
}

interface MentionSelectorProps {
  items: MentionItem[];
  command: (item: MentionItem) => void;
  query: string;
  loading: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

export const MentionSelector = forwardRef<HTMLDivElement, MentionSelectorProps>(({
  items, 
  command, 
  query,
  loading,
  selectedIndex,
  setSelectedIndex,
}, ref) => {
  // Handle item selection
  const handleItemSelect = (item: MentionItem) => {
    command(item);
  };
  
  // Auto-select first item when items change
  useEffect(() => {
    if (items.length > 0 && selectedIndex >= items.length) {
      setSelectedIndex(0);
    }
  }, [items, selectedIndex, setSelectedIndex]);
  
  // If there are no matching items or the query is too short, don't show anything
  if (loading || items.length === 0 || !query || query.length < 3) {
    return null;
  }
  
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
  
  // Only show the selected item
  const item = items[selectedIndex];
  
  if (!item) return null;
  
  return (
    <div 
      ref={ref}
      data-mention-active="true"
      className="inline-flex items-center px-1.5 py-0.5 bg-zinc-100 rounded-md text-sm mx-1"
      onClick={() => handleItemSelect(item)}
    >
      <span className="mr-1">{getTypeIcon(item.type)}</span>
      <span>{item.label}</span>
    </div>
  );
});

MentionSelector.displayName = 'MentionSelector';
