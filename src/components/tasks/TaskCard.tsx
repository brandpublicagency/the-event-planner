import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Task } from "@/contexts/TaskContext";

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <Card
      className={cn(
        "hover:border-primary/50 cursor-pointer transition-colors",
        isSelected && "border-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-sm">{task.title}</h3>
            <p className="text-xs text-muted-foreground text-[0.7rem]">{task.task_code}</p>
          </div>
          {task.priority && (
            <Badge variant="secondary" className={cn(priorityColors[task.priority as keyof typeof priorityColors])}>
              {task.priority}
            </Badge>
          )}
        </div>
        
        {(task.due_date || task.assigned_to) && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), "MMM d")}
              </div>
            )}
            {task.assigned_to && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Assigned
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}