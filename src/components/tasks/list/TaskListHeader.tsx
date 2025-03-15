
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, CheckCircle } from "lucide-react";

interface TaskListHeaderProps {
  upcomingCount: number;
  completedCount: number;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function TaskListHeader({ 
  upcomingCount, 
  completedCount, 
  activeTab, 
  onTabChange 
}: TaskListHeaderProps) {
  return (
    <div className="w-full mb-4">
      <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">
            <CalendarClock className="h-4 w-4 mr-2" />
            Upcoming ({upcomingCount})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed ({completedCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
