
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface EventDetailsErrorProps {
  error: Error | unknown;
  onBackButtonClick: () => void;
  onRefetch: () => void;
}

export const EventDetailsError: React.FC<EventDetailsErrorProps> = ({
  error,
  onBackButtonClick,
  onRefetch
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-8">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Event</h2>
            <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'Failed to load event details'}</p>
            <div className="flex space-x-3">
              <Button onClick={onBackButtonClick} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
              <Button onClick={onRefetch} variant="default" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
