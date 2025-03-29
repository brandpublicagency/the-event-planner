
import React from 'react';
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationEmptyProps {
  loading: boolean;
  onRefresh: () => void;
}

export const NotificationEmpty = ({ loading, onRefresh }: NotificationEmptyProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-3 text-center">
      <p className="text-sm text-gray-500">
        {loading ? "Loading notifications..." : "No notifications to display"}
      </p>
      <Button variant="ghost" size="sm" onClick={onRefresh} className="mt-2 h-7">
        <RefreshCw className="h-3 w-3 mr-1" />
        Refresh
      </Button>
    </div>
  );
};
