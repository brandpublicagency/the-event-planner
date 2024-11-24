import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Task } from "@/contexts/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const updateTaskMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      setIsUpdating(true);
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", task.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: task.completed ? "Task uncompleted" : "Task completed",
        description: `"${task.title}" has been ${task.completed ? "uncompleted" : "completed"}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUpdating(false);
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
    >
      <CardContent className="p-4">
        <div className="space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              {isUpdating ? (
                <div className="h-4 w-4 flex items-center justify-center">
                  <Loader2 className="h-3 w-3 animate-spin" />
                </div>
              ) : (
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => {
                    updateTaskMutation.mutate(checked as boolean);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="transition-colors"
                />
              )}
            </div>
            <div className="flex items-start justify-between gap-3 flex-1" onClick={onClick}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className={cn(
                    "font-medium text-sm leading-tight",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </h3>
                  <span className="text-[0.7rem] text-muted-foreground font-medium">
                    {task.task_code}
                  </span>
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(task.due_date), "dd MMMM yyyy")}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {task.priority && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-[0.65rem] font-medium px-2 py-0.5",
                      priorityColors[task.priority as keyof typeof priorityColors]
                    )}
                  >
                    {task.priority}
                  </Badge>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:border-destructive/50"
                      disabled={isDeleting}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 text-destructive transition-colors" />
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
                      <AlertDialogAction 
                        onClick={() => deleteTaskMutation.mutate()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}