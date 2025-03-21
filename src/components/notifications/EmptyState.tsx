
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  refreshWithState: () => void;
}

export const EmptyState = ({ refreshWithState }: EmptyStateProps) => {
  return (
    <div className="bg-white shadow rounded-lg text-center py-16 px-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
      <p className="text-muted-foreground mb-6">You don't have any notifications at the moment</p>
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
