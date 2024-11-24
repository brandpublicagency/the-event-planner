import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Calendar, User, Flag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  task_code: string;
  due_date: string | null;
  priority: string | null;
  assigned_to: string | null;
}

const TaskList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState<Date>();
  const [editPriority, setEditPriority] = useState<string>("");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        return [];
      }
      return data as Task[];
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updates: Partial<Task> & { id: string }) => {
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", updates.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
      setEditingTask(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.due_date ? new Date(task.due_date) : undefined);
    setEditPriority(task.priority || "");
  };

  const handleSave = (taskId: string) => {
    updateTaskMutation.mutate({
      id: taskId,
      title: editTitle,
      due_date: editDueDate?.toISOString(),
      priority: editPriority || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-2">
        {tasks?.map((task) => (
          <Card
            key={task.id}
            className="p-3 hover:border-primary/50 cursor-pointer transition-colors"
            onClick={() => startEditing(task)}
          >
            {editingTask === task.id ? (
              <div className="space-y-4">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Task title"
                  className="font-medium"
                />
                <div className="flex items-center gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal w-[240px]",
                          !editDueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDueDate ? format(editDueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={editDueDate}
                        onSelect={setEditDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Select value={editPriority} onValueChange={setEditPriority}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingTask(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSave(task.id)}>Save</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-zinc-900 truncate">{task.title}</h4>
                      <Badge variant="secondary" className="bg-zinc-100 text-zinc-600">
                        {task.task_code?.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      {task.due_date && (
                        <>
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(task.due_date), "MMM d, yyyy")}</span>
                        </>
                      )}
                      {task.priority && (
                        <>
                          <span>•</span>
                          <Flag className="h-3 w-3" />
                          <Badge variant="secondary" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                            {task.priority}
                          </Badge>
                        </>
                      )}
                      {task.assigned_to && (
                        <>
                          <span>•</span>
                          <User className="h-3 w-3" />
                          <span>Assigned</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
        {tasks?.length === 0 && (
          <p className="text-center text-gray-500 py-8">No tasks found</p>
        )}
      </div>
    </ScrollArea>
  );
};

export default TaskList;