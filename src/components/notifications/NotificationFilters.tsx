
import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';

export type FilterType = 'all' | 'unread' | 'read';

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
      
      // Force a filter change to refresh the view, especially needed for the read tab
      // This ensures notifications that were just marked as read appear immediately in the right tab
      if (currentFilter) {
        console.log(`NotificationFilters: Refreshing "${currentFilter}" tab view`);
        onFilterChange(currentFilter);
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
