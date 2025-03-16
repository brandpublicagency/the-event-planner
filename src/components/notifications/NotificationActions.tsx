
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface NotificationActionsProps {
  onMarkAllRead: () => void;
  loading?: boolean;
}

export const NotificationActions: React.FC<NotificationActionsProps> = ({
  onMarkAllRead,
  loading = false
}) => {
  // This component now only has the essential action
  return (
    <div className="flex items-center gap-2">
      {/* No buttons as per request */}
    </div>
  );
};
