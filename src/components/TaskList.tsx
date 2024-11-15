import { Check, Clock, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TaskList = () => {
  const [newTask, setNewTask] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
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
        }]);
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

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          Tasks
          <Badge variant="outline" className="text-xs">
            {tasks.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form onSubmit={handleAddTask} className="mb-6">
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-x-3 rounded-lg border border-zinc-200 px-4 py-3 hover:bg-zinc-50 transition-all duration-200"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-5 w-5 ${
                  task.completed ? "text-green-500" : "text-zinc-400"
                }`}
                onClick={() =>
                  toggleTaskMutation.mutate({
                    id: task.id,
                    completed: !task.completed,
                  })
                }
              >
                {task.completed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </Button>
              <span
                className={`flex-1 text-sm ${
                  task.completed ? "line-through text-zinc-400" : ""
                }`}
              >
                {task.title}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem
                    onClick={() =>
                      toggleTaskMutation.mutate({
                        id: task.id,
                        completed: !task.completed,
                      })
                    }
                  >
                    Mark as {task.completed ? "incomplete" : "complete"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-zinc-500 text-sm py-4">
              No tasks yet. Add one above!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;