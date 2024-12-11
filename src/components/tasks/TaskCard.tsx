import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/contexts/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TaskStatusBadges } from "./TaskStatusBadges";
import { TaskActions } from "./TaskActions";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const updateTaskMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", task.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted.`,
      });
    },
    onError: (error: Error) => {
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
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => {
                updateTaskMutation.mutate(checked as boolean);
              }}
              onClick={(e) => e.stopPropagation()}
              className="transition-colors rounded-[3px]"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className={cn(
                    "font-medium text-sm leading-none",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </h3>
                  <span className="text-[0.65rem] text-muted-foreground">
                    {task.task_code}
                  </span>
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(task.due_date), "dd MMMM yyyy")}
                  </div>
                )}
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