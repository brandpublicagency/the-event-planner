import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ListChecks } from "lucide-react";

interface TodoListProps {
  todos: string[];
  onTodosChange: (todos: string[]) => void;
}

export function TodoList({ todos = [], onTodosChange }: TodoListProps) {
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    onTodosChange([...todos, newTodo]);
    setNewTodo("");
  };

  const handleUpdateTodo = (index: number, value: string) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = value;
    onTodosChange(updatedTodos);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Checklist</h3>
      </div>
      <div className="space-y-2">
        {todos.map((todo, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox id={`todo-${index}`} />
            <Input
              value={todo}
              onChange={(e) => handleUpdateTodo(index, e.target.value)}
              className="h-8 text-sm"
            />
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
            className="shrink-0 h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}