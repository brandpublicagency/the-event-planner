
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
  return (
    <div className="my-4">
      <Tabs value={currentFilter} onValueChange={(v) => onFilterChange(v as FilterType)} className="w-full">
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
