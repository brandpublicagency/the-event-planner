
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationErrorProps {
  onRefresh: () => void;
}

export const NotificationError = ({ onRefresh }: NotificationErrorProps) => {
  return (
    <Alert variant="destructive" className="mt-2 mb-4">
      <AlertCircle className="h-3.5 w-3.5" />
      <AlertDescription className="flex justify-between items-center text-xs">
        <span>There was a problem loading notifications</span>
        <Button variant="outline" size="sm" onClick={onRefresh} className="ml-2 h-6 text-[10px]">
          <RefreshCw className="h-2.5 w-2.5 mr-1" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};
