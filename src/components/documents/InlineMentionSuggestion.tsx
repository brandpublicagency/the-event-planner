
import React, { useEffect, useRef, useState } from 'react';
import { MentionItem } from './MentionSelector';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, CheckSquare, File, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface InlineMentionSuggestionsProps {
  query: string;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
  position: { top: number; left: number } | null;
  mentionType: string | null;
}

export const InlineMentionSuggestions: React.FC<InlineMentionSuggestionsProps> = ({
  query,
  onSelect,
  onClose,
  position,
  mentionType
}) => {
  const [items, setItems] = useState<MentionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset selected index when query changes
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!position) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(items.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + items.length) % Math.max(items.length, 1));
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (items.length > 0) {
          onSelect(items[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onSelect, onClose, position]);

  // Fetch items based on query and mention type
  useEffect(() => {
    if (!mentionType || !position) return;

    const fetchItems = async () => {
      setLoading(true);
      
      try {
        if (mentionType === 'task') {
          const { data } = await supabase
            .from('tasks')
            .select('id, title')
            .ilike('title', `%${query}%`)
            .limit(5);
            
          setItems(
            (data || []).map(task => ({
              id: task.id,
              type: 'task',
              label: task.title
            }))
          );
        } else if (mentionType === 'event') {
          const { data } = await supabase
            .from('events')
            .select('event_code, name')
            .or(`name.ilike.%${query}%,event_code.ilike.%${query}%`)
            .is('deleted_at', null)
            .limit(5);
            
          setItems(
            (data || []).map(event => ({
              id: event.event_code,
              type: 'event',
              label: event.name
            }))
          );
        } else if (mentionType === 'document') {
          const { data } = await supabase
            .from('documents')
            .select('id, title')
            .ilike('title', `%${query}%`)
            .is('deleted_at', null)
            .limit(5);
            
          setItems(
            (data || []).map(doc => ({
              id: doc.id,
              type: 'document',
              label: doc.title
            }))
          );
        } else if (mentionType === 'user') {
          const { data } = await supabase
            .from('profiles')
            .select('id, full_name')
            .ilike('full_name', `%${query}%`)
            .limit(5);
            
          setItems(
            (data || []).map(user => ({
              id: user.id,
              type: 'user',
              label: user.full_name
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching mention suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a query or it's the initial "/type" command
    if (position) {
      fetchItems();
    }
  }, [query, mentionType, position]);

  if (!position) return null;

  // Function to get icon for item type
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
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
      className="absolute z-50 bg-white rounded-md shadow-md border border-gray-200 w-64 max-h-60 overflow-y-auto"
      style={{
        top: position.top + 'px',
        left: position.left + 'px'
      }}
    >
      {loading ? (
        <div className="p-2 space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      ) : items.length > 0 ? (
        <div className="py-1">
          {items.map((item, index) => (
            <div
              key={`${item.type}-${item.id}`}
              className={`flex items-center px-3 py-2 cursor-pointer ${
                index === selectedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => onSelect(item)}
            >
              <div className="mr-2 text-gray-500">
                {getItemIcon(item.type)}
              </div>
              <div className="flex-1 truncate">{item.label}</div>
              {index === selectedIndex && (
                <div className="text-xs text-gray-500 ml-2">Press Tab</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 text-sm text-gray-500">
          {mentionType ? (
            query ? `No ${mentionType}s found matching "${query}"` : `Type to search ${mentionType}s`
          ) : (
            'Type /task, /event, /document, or /user'
          )}
        </div>
      )}
    </div>
  );
};
