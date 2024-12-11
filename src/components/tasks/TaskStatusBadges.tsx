import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { isPast } from "date-fns";

interface TaskStatusBadgesProps {
  priority: string | null;
  dueDate: string | null;
}

export function TaskStatusBadges({ priority, dueDate }: TaskStatusBadgesProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const isOverdue = dueDate && isPast(new Date(dueDate));

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {isOverdue && (
        <Badge variant="secondary" className="bg-red-100 text-red-800 text-[0.65rem] px-2 py-0.5">
          Overdue
        </Badge>
      )}
      {priority && (
        <Badge 
          variant="secondary" 
          className={`text-[0.65rem] px-2 py-0.5 ${
            priorityColors[priority as keyof typeof priorityColors]
          }`}
        >
          {priority}
        </Badge>
      )}
    </div>
  );
}