import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskContext } from "@/contexts/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  priority: string | null;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskItem({
  id,
  title,
  completed,
  dueDate,
  priority,
  isSelected,
  onClick,
}: TaskItemProps) {
  const { toggleTask } = useTaskContext();

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
            onClick={onClick}
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
            <Badge variant="secondary" className="bg-zinc-100 text-zinc-600">
              {priority}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}