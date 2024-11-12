import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CalendarHeaderProps {
  profileName?: string;
  isLoading?: boolean;
}

export const CalendarHeader = ({ profileName, isLoading }: CalendarHeaderProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 bg-white">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-zinc-100 rounded-lg">
            <CalendarIcon className="h-6 w-6 text-zinc-400" />
          </div>
          <Skeleton className="h-6 w-48" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-zinc-100 rounded-lg">
          <CalendarIcon className="h-6 w-6 text-zinc-900" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900">
          {profileName ? `${profileName}'s Calendar` : "Your Calendar"}
        </h3>
      </div>
    </Card>
  );
};