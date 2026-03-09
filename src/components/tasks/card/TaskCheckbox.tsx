
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskCheckboxProps {
  taskId: string;
  completed: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export function TaskCheckbox({ taskId, completed, onClick }: TaskCheckboxProps) {
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: Error) => {
      console.error("Error updating task:", error.message);
    },
  });

  return (
    <Checkbox
      checked={completed}
      onCheckedChange={(checked) => {
        updateTaskMutation.mutate(checked as boolean);
      }}
      onClick={onClick}
      className="transition-colors rounded-[3px] border-border bg-background data-[state=checked]:bg-foreground data-[state=checked]:text-background"
    />
  );
}
