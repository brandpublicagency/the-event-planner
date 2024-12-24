import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface TaskDueDateProps {
  dueDate: string;
}

export function TaskDueDate({ dueDate }: TaskDueDateProps) {
  if (!dueDate) return null;
  
  return (
    <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
      <Calendar className="h-3 w-3" />
      {format(new Date(dueDate), "dd MMMM yyyy")}
    </div>
  );
}