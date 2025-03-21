
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface NotificationFooterProps {
  unreadCount: number;
  onViewAll: (e: React.MouseEvent) => void;
}

export const NotificationFooter: React.FC<NotificationFooterProps> = ({
  unreadCount,
  onViewAll
}) => {
  return (
    <div className="border-t p-3 bg-gray-50">
      <Button 
        variant="outline" 
        onClick={onViewAll}
        size="sm"
        className="w-full rounded-md text-zinc-700 bg-white hover:bg-zinc-100 border-zinc-200 transition-colors"
      >
        <ExternalLink className="h-3.5 w-3.5 mr-2" />
        {unreadCount > 0 
          ? `See all notifications (${unreadCount} unread)` 
          : 'See all notifications'}
      </Button>
    </div>
  );
};
