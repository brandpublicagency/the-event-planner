
import React from "react";
import { Button } from "@/components/ui/button";

interface NotificationFooterProps {
  unreadCount: number;
  onViewAll: (e: React.MouseEvent) => void;
}

export const NotificationFooter: React.FC<NotificationFooterProps> = ({
  unreadCount,
  onViewAll
}) => {
  return (
    <div className="border-t p-2">
      <Button 
        variant="outline" 
        onClick={onViewAll}
        className="w-full rounded text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border-zinc-200"
      >
        {unreadCount > 5 ? `See all notifications (${unreadCount})` : 'See all notifications'}
      </Button>
    </div>
  );
};
