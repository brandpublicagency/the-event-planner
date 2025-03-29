
import React from 'react';
import { Button } from "@/components/ui/button";

interface NotificationErrorStateProps {
  onRefresh: (e: React.MouseEvent) => void;
}

export const NotificationErrorState = ({ onRefresh }: NotificationErrorStateProps) => {
  return (
    <div className="p-3 text-center">
      <p className="text-sm text-red-500 mb-2">Failed to load notifications</p>
      <Button 
        variant="default" 
        size="sm"
        onClick={onRefresh}
        className="inline-flex items-center gap-1"
      >
        <span>Try again</span>
      </Button>
    </div>
  );
};
