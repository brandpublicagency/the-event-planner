import { Calendar, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskContext } from "@/contexts/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  priority: string | null;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function TaskItem({
  id,
  title,
  completed,
  dueDate,
  priority,
  isSelected,
  onClick,
  onEdit,
}: TaskItemProps) {
  const { toggleTask } = useTaskContext();
  const navigate = useNavigate();

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const handleTitleClick = () => {
    navigate(`/tasks?selected=${id}`);
  };

  return (
    <div
      className={cn(
        "group flex items-center px-4 py-3 hover:bg-zinc-50/50 transition-colors rounded-lg border bg-white",
        isSelected && "border-primary bg-primary/5"
      )}
    >
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={completed}
            onCheckedChange={(checked) => toggleTask(id, checked as boolean)}
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            variant="ghost"
            className="h-auto p-0 text-sm font-medium hover:text-primary"
            onClick={handleTitleClick}
          >
            {title}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(dueDate), "dd MMM yyyy")}</span>
            </div>
          )}
          {priority && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs",
                priorityColors[priority as keyof typeof priorityColors]
              )}
            >
              {priority}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </Button>
        </div>
      </div>
    </div>
  );
}