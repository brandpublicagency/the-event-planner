import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/contexts/TaskContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TaskStatusBadges } from "./TaskStatusBadges";
import { TaskActions } from "./TaskActions";
import { cn } from "@/lib/utils";
import { TaskCheckbox } from "./card/TaskCheckbox";
import { TaskTitle } from "./card/TaskTitle";
import { TaskDueDate } from "./card/TaskDueDate";

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);
      
      const { data: files, error: filesError } = await supabase
        .from("task_files")
        .select("file_path")
        .eq("task_id", task.id);

      if (filesError) throw filesError;

      if (files && files.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("task-files")
          .remove(files.map(file => file.file_path));

        if (storageError) throw storageError;
      }

      const { error: fileDeleteError } = await supabase
        .from("task_files")
        .delete()
        .eq("task_id", task.id);

      if (fileDeleteError) throw fileDeleteError;

      const { error: taskDeleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id)
        .eq("user_id", task.user_id);

      if (taskDeleteError) throw taskDeleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted.`,
      });
    },
    onError: (error: Error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  return (
    <Card
      className={cn(
        "hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-sm group",
        isSelected && "border-primary shadow-sm"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <TaskCheckbox
              taskId={task.id}
              completed={task.completed}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <TaskTitle
                  title={task.title}
                  taskCode={task.task_code}
                  completed={task.completed}
                />
                <TaskDueDate dueDate={task.due_date} />
              </div>
              <div className="flex items-center gap-2">
                <TaskStatusBadges 
                  priority={task.priority} 
                  dueDate={task.due_date}
                  completed={task.completed}
                />
                <TaskActions 
                  isDeleting={isDeleting}
                  onDelete={() => deleteTaskMutation.mutate()}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}