import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
}

export function TaskItem({ id, title, completed }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskContext();

  return (
    <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg group">
      <Checkbox
        id={id}
        checked={completed}
        onCheckedChange={(checked) => toggleTask(id, checked as boolean)}
      />
      <label
        htmlFor={id}
        className={`flex-1 text-sm ${completed ? "line-through text-gray-500" : ""}`}
      >
        {title}
      </label>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => deleteTask(id)}
      >
        <Trash2 className="h-4 w-4 text-gray-500" />
      </Button>
    </div>
  );
}