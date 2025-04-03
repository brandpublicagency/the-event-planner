
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface NotificationFooterProps {
  hasMoreNotifications: boolean;
  onViewAllNotifications: (e: React.MouseEvent) => void;
}

export const NotificationFooter = ({ 
  hasMoreNotifications, 
  onViewAllNotifications 
}: NotificationFooterProps) => {
  if (!hasMoreNotifications) return null;

  return (
    <div className="mt-2 text-right">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onViewAllNotifications} 
        className="text-[10px] text-primary hover:bg-primary/5 h-6 px-2"
      >
        <ExternalLink className="h-2.5 w-2.5 mr-1" />
        View all notifications
      </Button>
    </div>
  );
};
