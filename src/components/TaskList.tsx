import { useState } from "react";
import { Task } from "@/contexts/TaskContext";
import { TaskItem } from "./tasks/TaskItem";
import { EditableTaskCard } from "./tasks/EditableTaskCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (id: string) => void;
  selectedTaskId: string | null;
}

export function TaskList({ tasks, onTaskSelect, selectedTaskId }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { addTask, isLoading } = useTaskContext();

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle);
    setNewTaskTitle("");
  };

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
              id={task.id}
              title={task.title}
              completed={task.completed}
              dueDate={task.due_date}
              priority={task.priority}
              isSelected={task.id === selectedTaskId}
              onClick={() => onTaskSelect(task.id)}
              onEdit={() => setEditingTaskId(task.id)}
            />
          )
        ))}
        {!isLoading && tasks?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No tasks</p>
        )}
        
        {/* Only show the new task input in the upcoming tasks section */}
        {!tasks?.[0]?.completed && (
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
        )}
      </div>
    </div>
  );
}