import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskInsert } from "@/integrations/supabase/types/tasks";

interface SidebarTasksProps {
  isCollapsed: boolean;
}

const SidebarTasks = ({ isCollapsed }: SidebarTasksProps) => {
  const [newTask, setNewTask] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase
        .from("tasks")
        .insert([{ 
          title, 
          user_id: (await supabase.auth.getUser()).data.user?.id 
        } as TaskInsert]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTask("");
      setIsExpanded(true);
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTaskMutation.mutate(newTask.trim());
    }
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <div 
      className={cn(
        "transition-all duration-300 ease-in-out",
        isExpanded ? "bg-zinc-900 text-white" : ""
      )}
    >
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn(
            "font-medium transition-colors",
            isExpanded ? "text-white" : "text-zinc-900"
          )}>
            To-do List
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "text-xs",
              isExpanded ? "text-white hover:text-white/80" : "text-zinc-600"
            )}
          >
            {isExpanded ? "Close" : "View all tasks"}
            <ChevronRight className={cn(
              "ml-1 h-4 w-4 transition-transform",
              isExpanded ? "rotate-90" : ""
            )} />
          </Button>
        </div>

        <form onSubmit={handleAddTask} className="mb-4">
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className={cn(
                "w-full transition-colors",
                isExpanded ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400" : ""
              )}
            />
            <Button 
              type="submit" 
              size="icon"
              className={cn(
                "shrink-0",
                isExpanded ? "bg-white text-zinc-900 hover:bg-white/90" : ""
              )}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {isExpanded && (
          <div className="space-y-2 animate-in slide-in-from-top duration-300">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800 transition-colors"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => {
                    toggleTaskMutation.mutate({ id: task.id, completed: checked as boolean });
                  }}
                  className="border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:text-zinc-900"
                />
                <span className={cn(
                  "text-sm transition-opacity",
                  task.completed ? "line-through opacity-50" : ""
                )}>
                  {task.title}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-sm text-zinc-400 text-center py-2">No tasks yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarTasks;