
import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';

type FilterType = 'all' | 'unread' | 'read';

interface NotificationFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    unread: number;
    read: number;
  };
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  currentFilter,
  onFilterChange,
  counts
}) => {
  const { lastFilterRefresh } = useNotifications();
  
  // Force re-render when lastFilterRefresh changes
  useEffect(() => {
    if (lastFilterRefresh) {
      console.log(`NotificationFilters: Detected filter refresh trigger: ${lastFilterRefresh}`);
      
      // If we're in the read tab and a notification was just marked as read,
      // force a filter change to refresh the view
      if (currentFilter === 'read') {
        console.log('NotificationFilters: Refreshing "read" tab view');
        // Switch to 'all' and back to 'read' to force refresh
        onFilterChange('all');
        setTimeout(() => onFilterChange('read'), 50);
      }
    }
  }, [lastFilterRefresh, currentFilter, onFilterChange]);

  const handleFilterChange = (value: string) => {
    console.log(`NotificationFilters: Changing filter to ${value}`);
    onFilterChange(value as FilterType);
  };

  return (
    <div className="my-4">
      <Tabs 
        value={currentFilter} 
        onValueChange={handleFilterChange} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all" className="flex items-center justify-center gap-2">
            All
            <Badge variant="secondary" className="ml-1 bg-zinc-100 text-zinc-800">
              {counts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center justify-center gap-2">
            Unread
            <Badge variant="secondary" className="ml-1 bg-zinc-100 text-zinc-800">
              {counts.unread}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center justify-center gap-2">
            Read
            <Badge variant="secondary" className="ml-1 bg-zinc-100 text-zinc-800">
              {counts.read}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
