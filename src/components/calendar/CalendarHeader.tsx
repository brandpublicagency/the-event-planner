
import { CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CalendarHeaderProps {
  profileName?: string;
  isLoading?: boolean;
}

export const CalendarHeader = ({ profileName, isLoading }: CalendarHeaderProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-zinc-100 rounded-[1rem]">
          <CalendarDays className="h-5 w-5 text-zinc-400" />
        </div>
        <Skeleton className="h-6 w-48" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-zinc-100 rounded-[1rem]">
        <CalendarDays className="h-5 w-5 text-zinc-900" />
      </div>
      <h3 className="text-lg font-medium text-zinc-900">
        {profileName ? `${profileName}'s Calendar` : "Your Calendar"}
      </h3>
    </div>
  );
};
