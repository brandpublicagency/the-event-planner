
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/contexts/TaskContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  onTaskSelect: (taskId: string) => void;
  selectedTaskId: string | null;
}

export function TaskColumn({ title, tasks, status, onTaskSelect, selectedTaskId }: TaskColumnProps) {
  return (
    <Card className="flex-1 border-0">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <span className="text-xs font-medium text-muted-foreground">{tasks.length}</span>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-3 pr-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={task.id === selectedTaskId}
                onClick={() => onTaskSelect(task.id)}
              />
            ))}
            {tasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No tasks
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
