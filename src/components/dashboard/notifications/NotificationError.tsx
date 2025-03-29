
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
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex justify-between items-center">
        <span>There was a problem loading notifications</span>
        <Button variant="outline" size="sm" onClick={onRefresh} className="ml-2 h-7">
          <RefreshCw className="h-3 w-3 mr-1" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};
