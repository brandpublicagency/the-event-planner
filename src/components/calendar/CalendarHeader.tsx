import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

interface CalendarHeaderProps {
  profileName?: string;
  isLoading?: boolean;
}

export const CalendarHeader = ({ profileName, isLoading }: CalendarHeaderProps) => {
  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-primary-50 rounded-lg">
          <CalendarIcon className="h-6 w-6 text-primary-900" />
        </div>
        <h3 className="text-lg font-medium text-primary-900">
          {profileName ? `${profileName}'s Calendar` : "Your Calendar"}
        </h3>
      </div>
    </Card>
  );
};