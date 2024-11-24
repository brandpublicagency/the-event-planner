import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "@/contexts/TaskContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EditableTaskCardProps {
  task: Task;
  onCancel: () => void;
  onSave: () => void;
}

export function EditableTaskCard({ task, onCancel, onSave }: EditableTaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );
  const [priority, setPriority] = useState(task.priority || "");

  const updateTaskMutation = useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", task.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
      onSave();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateTaskMutation.mutate({
      title,
      due_date: dueDate?.toISOString(),
      priority: priority || null,
    });
  };

  return (
    <Card className="border-primary/50">
      <CardContent className="p-6 space-y-6">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="font-medium"
        />
        <div className="grid grid-cols-2 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}