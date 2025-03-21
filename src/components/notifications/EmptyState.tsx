
import React from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  refreshWithState: () => void;
}

export const EmptyState = ({ refreshWithState }: EmptyStateProps) => {
  return (
    <div className="bg-white shadow rounded-lg text-center py-12">
      <Bell className="h-10 w-10 text-zinc-300 mb-3" />
      <p className="text-muted-foreground mb-4">No notifications found</p>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={refreshWithState}
        className="mx-auto"
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Refresh
      </Button>
    </div>
  );
};
