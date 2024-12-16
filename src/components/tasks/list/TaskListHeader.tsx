import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskListHeaderProps {
  upcomingCount: number;
  completedCount: number;
}

export function TaskListHeader({ upcomingCount, completedCount }: TaskListHeaderProps) {
  return (
    <TabsList className="w-full">
      <TabsTrigger value="upcoming" className="flex-1">
        Upcoming ({upcomingCount})
      </TabsTrigger>
      <TabsTrigger value="completed" className="flex-1">
        Completed ({completedCount})
      </TabsTrigger>
    </TabsList>
  );
}