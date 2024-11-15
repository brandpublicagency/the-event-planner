import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task, TaskInsert } from "@/integrations/supabase/types/tasks";

interface SidebarTasksProps {
  isCollapsed: boolean;
}

const SidebarTasks = ({ isCollapsed }: SidebarTasksProps) => {
  const [newTask, setNewTask] = useState("");
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
    return (
      <div className="p-4">
        <button 
          onClick={() => toast({ title: "Expand sidebar", description: "Expand the sidebar to manage tasks" })}
          className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center hover:bg-gray-100"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-1">To-do List</h3>
      <p className="text-sm text-gray-500 mb-4">Keep track of your daily tasks</p>
      
      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit" size="sm" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => {
                toggleTaskMutation.mutate({ id: task.id, completed: checked as boolean });
              }}
            />
            <span className={`text-sm ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarTasks;