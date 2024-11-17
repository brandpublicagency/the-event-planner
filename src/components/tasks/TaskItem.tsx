import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
}

export function TaskItem({ id, title, completed }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      await toggleTask(id, checked);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 hover:bg-accent rounded-lg group transition-colors">
      <div className="relative">
        {isUpdating ? (
          <div className="h-4 w-4 flex items-center justify-center">
            <Loader2 className="h-3 w-3 animate-spin" />
          </div>
        ) : (
          <Checkbox
            id={id}
            checked={completed}
            onCheckedChange={handleToggle}
            className="transition-colors"
          />
        )}
      </div>
      <label
        htmlFor={id}
        className={`flex-1 text-sm cursor-pointer select-none ${
          completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {title}
      </label>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}