import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
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
        "hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-sm",
        isSelected && "border-primary shadow-sm"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium text-sm leading-tight flex-1">{task.title}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[0.7rem] text-muted-foreground font-medium">{task.task_code}</span>
              {task.priority && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-[0.65rem] font-medium px-2 py-0.5",
                    priorityColors[task.priority as keyof typeof priorityColors]
                  )}
                >
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>
          
          {task.due_date && (
            <div className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.due_date), "dd MMMM yyyy")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}