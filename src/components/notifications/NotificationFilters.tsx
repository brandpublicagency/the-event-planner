
import React, { useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  const lastRefreshRef = useRef<number>(0);
  const previousFilterRef = useRef<FilterType>(currentFilter);
  
  // Force re-render when lastFilterRefresh changes or when currentFilter changes
  useEffect(() => {
    // When filter refresh is explicitly triggered via lastFilterRefresh
    if (lastFilterRefresh && lastFilterRefresh > lastRefreshRef.current) {
      console.log(`NotificationFilters: Detected filter refresh trigger: ${lastFilterRefresh}`);
      lastRefreshRef.current = lastFilterRefresh;
      
      // Force a filter change to refresh the view with the same filter
      if (currentFilter) {
        console.log(`NotificationFilters: Refreshing "${currentFilter}" tab view`);
        onFilterChange(currentFilter);
      }
    }
    
    // When currentFilter changes between renders, update the ref
    if (currentFilter !== previousFilterRef.current) {
      console.log(`NotificationFilters: Filter changed from ${previousFilterRef.current} to ${currentFilter}`);
      previousFilterRef.current = currentFilter;
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
