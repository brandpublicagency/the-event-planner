
import React, { forwardRef, memo } from 'react';
import { Calendar, CheckSquare, File, User } from 'lucide-react';

export interface MentionItem {
  id: string;
  label: string;
  type: 'event' | 'task' | 'document' | 'user';
}

interface MentionSelectorProps {
  items: MentionItem[];
  onSelect: (item: MentionItem) => void;
  query: string;
  loading: boolean;
  selectedIndex: number;
}

export const MentionSelector = memo(forwardRef<HTMLDivElement, MentionSelectorProps>(({
  items, 
  onSelect, 
  query,
  loading,
  selectedIndex,
}, ref) => {
  // If there are no items or we're loading, don't show anything
  if (loading) {
    return (
      <div 
        ref={ref} 
        className="absolute z-50 bg-white shadow-lg rounded-md border border-zinc-200 py-3 px-4 w-60"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">Loading suggestions...</p>
          <div className="animate-spin h-4 w-4 border-2 border-zinc-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  // Debug - check if items are available
  React.useEffect(() => {
    console.log('MentionSelector rendered with items:', items.length);
  }, [items]);
  
  if (items.length === 0) {
    return (
      <div 
        ref={ref} 
        className="absolute z-50 bg-white shadow-lg rounded-md border border-zinc-200 py-3 px-4 w-60"
      >
        <p className="text-sm text-zinc-500">No results found for "{query}"</p>
      </div>
    );
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
  
  return (
    <div 
      ref={ref}
      className="absolute z-50 bg-white shadow-lg rounded-md border border-zinc-200 py-1 w-60 max-h-48 overflow-y-auto"
    >
      <div className="p-2 border-b border-zinc-100 bg-zinc-50">
        <p className="text-xs text-zinc-500">Results for "{query}"</p>
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          className={`px-2 py-1.5 flex items-center hover:bg-zinc-100 cursor-pointer ${
            index === selectedIndex ? 'bg-zinc-100' : ''
          }`}
        >
          <span className="mr-2">{getTypeIcon(item.type)}</span>
          <span className="text-sm font-medium">{item.label}</span>
          <span className="ml-auto text-xs text-zinc-500">{item.type}</span>
        </div>
      ))}
    </div>
  );
}));

MentionSelector.displayName = 'MentionSelector';
