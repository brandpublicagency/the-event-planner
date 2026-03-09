
import React from 'react';
import { Button } from "@/components/ui/button";

interface NotificationEmptyStateProps {
  onRefresh: (e: React.MouseEvent) => void;
}

export const NotificationEmptyState = ({ onRefresh }: NotificationEmptyStateProps) => {
  return (
    <div className="p-3 text-center">
      <p className="text-sm text-muted-foreground">No notifications to display</p>
      <Button
        variant="default"
        size="sm"
        onClick={onRefresh}
        className="mt-2"
      >
        Refresh
      </Button>
    </div>
  );
};
