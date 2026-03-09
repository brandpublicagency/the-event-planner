
import React from 'react';
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationEmptyProps {
  loading: boolean;
  onRefresh: () => void;
}

export const NotificationEmpty = ({ loading, onRefresh }: NotificationEmptyProps) => {
  return (
    <div className="bg-card shadow-sm rounded-lg p-3 text-center">
      <p className="text-xs text-muted-foreground">
        {loading ? "Loading notifications..." : "No notifications to display"}
      </p>
      <Button variant="ghost" size="sm" onClick={onRefresh} className="mt-2 h-6 text-[10px]">
        <RefreshCw className="h-2.5 w-2.5 mr-1" />
        Refresh
      </Button>
    </div>
  );
};
