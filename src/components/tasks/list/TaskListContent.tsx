import { Task } from "@/contexts/task/taskTypes";
import { EditableTaskCard } from "../EditableTaskCard";
import { TaskItem } from "../TaskItem";
interface TaskListContentProps {
  tasks: Task[];
  editingTaskId: string | null;
  selectedTaskId: string | null;
  onTaskSelect: (id: string) => void;
  onEditStart: (id: string) => void;
  onEditCancel: () => void;
  onEditSave: () => void;
}
export function TaskListContent({
  tasks,
  editingTaskId,
  selectedTaskId,
  onTaskSelect,
  onEditStart,
  onEditCancel,
  onEditSave
}: TaskListContentProps) {
  return <div className="space-y-2 rounded-none my-0 py-[4px]">
      {tasks?.map(task => editingTaskId === task.id ? <EditableTaskCard key={task.id} task={task} onCancel={onEditCancel} onSave={onEditSave} /> : <TaskItem key={task.id} task={task} isSelected={task.id === selectedTaskId} onClick={() => onTaskSelect(task.id)} onEdit={() => onEditStart(task.id)} />)}
      {!tasks || tasks.length === 0 && <p className="text-center text-muted-foreground py-8">No tasks</p>}
    </div>;
}