
import { Calendar, Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskContext } from "@/contexts/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskActions } from "./TaskActions";
import { Task } from "@/contexts/TaskContext";

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function TaskItem({
  task,
  isSelected,
  onClick,
  onEdit
}: TaskItemProps) {
  const {
    toggleTask,
    deleteTask
  } = useTaskContext();

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  };

  return (
    <div 
      className={cn(
        "group flex items-center px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer", 
        isSelected && "border-primary"
      )} 
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full gap-4 py-0">
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={(checked) => {
              toggleTask(task.id, checked as boolean);
              // Prevent the onClick event from bubbling up
              event?.stopPropagation();
            }} 
          />
          <span className="text-sm font-medium hover:text-primary">
            {task.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.due_date), "dd MMM yyyy")}</span>
            </div>
          )}
          {task.priority && (
            <Badge 
              variant="secondary" 
              className={cn("text-xs", priorityColors[task.priority as keyof typeof priorityColors])}
            >
              {task.priority}
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }} 
            className="h-6 w-6"
          >
            <Edit className="h-3 w-3 text-muted-foreground" />
          </Button>
          <TaskActions 
            isDeleting={false} 
            onDelete={() => {
              deleteTask(task.id);
            }} 
          />
        </div>
      </div>
    </div>
  );
}
