
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface NotificationFooterProps {
  onViewAll: (e: React.MouseEvent) => void;
}

export const NotificationFooter: React.FC<NotificationFooterProps> = ({
  onViewAll
}) => {
  return (
    <div className="p-3">
      <Button
        onClick={onViewAll}
        className="w-full flex items-center justify-center h-8"
        variant="outline"
        size="sm"
      >
        <ExternalLink className="h-3.5 w-3.5 mr-2" />
        <span className="text-xs">View all notifications</span>
      </Button>
    </div>
  );
};
