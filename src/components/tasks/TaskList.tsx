import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTaskContext } from "@/contexts/TaskContext";
import { TaskItem } from "./TaskItem";
import { Loader2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TaskList() {
  const { tasks, isLoading, addTask } = useTaskContext();
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await addTask(newTaskTitle.trim());
    setNewTaskTitle("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newTaskTitle.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}
            />
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-gray-500 py-4">No tasks yet</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}