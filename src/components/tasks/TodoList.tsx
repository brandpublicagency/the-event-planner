import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ListChecks, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface TodoListProps {
  todos: string[];
  onTodosChange: (todos: string[]) => void;
  taskId: string;
}

interface Todo {
  text: string;
  checked: boolean;
}

export function TodoList({ todos = [], onTodosChange, taskId }: TodoListProps) {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient();

  const parsedTodos: Todo[] = todos.map(todo => {
    try {
      const parsed = JSON.parse(todo);
      return typeof parsed === 'object' && parsed.text ? parsed : { text: todo, checked: false };
    } catch {
      return { text: todo, checked: false };
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTodos: Todo[]) => {
      const { error } = await supabase
        .from("tasks")
        .update({ 
          todos: updatedTodos.map(todo => JSON.stringify(todo))
        })
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    const newTodoItem = { text: newTodo, checked: false };
    const updatedTodos = [...parsedTodos, newTodoItem];
    updateTaskMutation.mutate(updatedTodos);
    onTodosChange(updatedTodos.map(todo => JSON.stringify(todo)));
    setNewTodo("");
  };

  const handleUpdateTodo = (index: number, value: string) => {
    const updatedTodos = [...parsedTodos];
    updatedTodos[index] = { ...updatedTodos[index], text: value };
    updateTaskMutation.mutate(updatedTodos);
    onTodosChange(updatedTodos.map(todo => JSON.stringify(todo)));
  };

  const handleDeleteTodo = (index: number) => {
    const updatedTodos = parsedTodos.filter((_, i) => i !== index);
    updateTaskMutation.mutate(updatedTodos);
    onTodosChange(updatedTodos.map(todo => JSON.stringify(todo)));
  };

  const handleToggleTodo = (index: number, checked: boolean) => {
    const updatedTodos = [...parsedTodos];
    updatedTodos[index] = { ...updatedTodos[index], checked };
    updateTaskMutation.mutate(updatedTodos);
    onTodosChange(updatedTodos.map(todo => JSON.stringify(todo)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Checklist</h3>
      </div>
      <div className="space-y-2">
        {parsedTodos.map((todo, index) => (
          <div key={index} className="flex items-center space-x-2 group">
            <Checkbox 
              checked={todo.checked}
              onCheckedChange={(checked) => handleToggleTodo(index, checked as boolean)}
            />
            <Input
              value={todo.text}
              onChange={(e) => handleUpdateTodo(index, e.target.value)}
              className={cn(
                "h-8 text-sm",
                todo.checked && "line-through text-muted-foreground"
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteTodo(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Add checklist item"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
            className="h-8 text-sm"
          />
          <Button 
            onClick={handleAddTodo} 
            disabled={!newTodo.trim()}
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full bg-background border-border hover:bg-muted hover:text-foreground"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
