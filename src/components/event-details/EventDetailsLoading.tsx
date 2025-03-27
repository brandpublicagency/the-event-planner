
import React from "react";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export interface EventDetailsLoadingProps {
  onBackButtonClick: () => void;
}

export const EventDetailsLoading: React.FC<EventDetailsLoadingProps> = ({ 
  onBackButtonClick 
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  );
};
