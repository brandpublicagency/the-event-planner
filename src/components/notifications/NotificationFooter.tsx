
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
    <div className="p-2.5">
      <Button
        onClick={onViewAll}
        className="w-full flex items-center justify-center h-7"
        variant="outline"
        size="sm"
      >
        <ExternalLink className="h-3 w-3 mr-1.5" />
        <span className="text-[10px]">View all notifications</span>
      </Button>
    </div>
  );
};
