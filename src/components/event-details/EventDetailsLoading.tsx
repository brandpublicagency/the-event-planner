
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface EventDetailsLoadingProps {
  onBackButtonClick: () => void;
}

export const EventDetailsLoading: React.FC<EventDetailsLoadingProps> = ({ 
  onBackButtonClick 
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center">
        <Button 
          onClick={onBackButtonClick} 
          variant="outline" 
          size="sm" 
          className="mr-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>
      </div>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  );
};
