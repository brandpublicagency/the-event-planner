import { useState } from "react";
import { Task } from "@/contexts/task/taskTypes";
import { TaskItem } from "./tasks/TaskItem";
import { EditableTaskCard } from "./tasks/EditableTaskCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (id: string) => void;
  selectedTaskId: string | null;
}

export function TaskList({ tasks, onTaskSelect, selectedTaskId }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { addTask, isLoading, error } = useTaskContext();

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      await addTask(newTaskTitle);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load tasks. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {tasks?.map((task) => (
          editingTaskId === task.id ? (
            <EditableTaskCard
              key={task.id}
              task={task}
              onCancel={() => setEditingTaskId(null)}
              onSave={() => setEditingTaskId(null)}
            />
          ) : (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={task.id === selectedTaskId}
              onClick={() => onTaskSelect(task.id)}
              onEdit={() => setEditingTaskId(task.id)}
            />
          )
        ))}
        {!isLoading && (!tasks || tasks.length === 0) && (
          <p className="text-center text-muted-foreground py-8">No tasks</p>
        )}
        
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
            className="h-9"
          />
          <Button 
            size="sm"
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
            className="h-9"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}