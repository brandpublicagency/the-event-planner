import { useState } from "react";
import { Task } from "@/contexts/TaskContext";
import { TaskItem } from "./tasks/TaskItem";
import { EditableTaskCard } from "./tasks/EditableTaskCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewTaskForm } from "./tasks/NewTaskForm";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (id: string) => void;
  selectedTaskId: string | null;
}

export function TaskList({ tasks, onTaskSelect, selectedTaskId }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <NewTaskForm onSuccess={() => setIsNewTaskDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

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
        {tasks?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No tasks</p>
        )}
      </div>
    </div>
  );
}