import { useState } from "react";
import { Task } from "@/contexts/TaskContext";
import { TaskItem } from "./tasks/TaskItem";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (id: string) => void;
  selectedTaskId: string | null;
}

export function TaskList({ tasks, onTaskSelect, selectedTaskId }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks?.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          title={task.title}
          completed={task.completed}
          dueDate={task.due_date}
          priority={task.priority}
          isSelected={task.id === selectedTaskId}
          onClick={() => onTaskSelect(task.id)}
        />
      ))}
      {tasks?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No tasks</p>
      )}
    </div>
  );
}