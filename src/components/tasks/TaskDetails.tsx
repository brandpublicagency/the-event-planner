import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Paperclip, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { TaskFiles } from "./TaskFiles";
import { TaskNotes } from "./TaskNotes";

interface TaskDetailsProps {
  taskId: string;
  onClose: () => void;
}

export function TaskDetails({ taskId, onClose }: TaskDetailsProps) {
  const { tasks } = useTaskContext();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return null;

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between p-6 border-b">
        <div className="space-y-1.5">
          <h2 className="text-xl font-medium leading-none">{task.title}</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {task.due_date && (
              <span>Due {format(new Date(task.due_date), "dd MMMM yyyy")}</span>
            )}
            {task.priority && (
              <Badge variant="secondary" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                {task.priority}
              </Badge>
            )}
            <Badge variant="outline">{task.task_code}</Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4 text-sm font-medium">
              <CheckSquare className="h-4 w-4" />
              Notes
            </div>
            <TaskNotes taskId={taskId} />
          </section>
          
          <Separator />
          
          <section>
            <div className="flex items-center gap-2 mb-4 text-sm font-medium">
              <Paperclip className="h-4 w-4" />
              Files
            </div>
            <TaskFiles taskId={taskId} />
          </section>
        </div>
      </div>
    </div>
  );
}