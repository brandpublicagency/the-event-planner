
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const NotificationLoading = () => {
  return (
    <div className="space-y-2 p-2 bg-card rounded-b-lg shadow-sm">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-start gap-2 p-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};
