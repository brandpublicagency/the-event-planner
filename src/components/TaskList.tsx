import { useState, useEffect, useRef } from "react";
import { Task } from "@/contexts/task/taskTypes";
import { Loader2, AlertCircle } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TaskListHeader } from "./tasks/list/TaskListHeader";
import { TaskListContent } from "./tasks/list/TaskListContent";
import { AddTaskInput } from "./tasks/list/AddTaskInput";
import { toast } from "sonner";
interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (id: string) => void;
  selectedTaskId: string | null;
  focusNewTaskInput?: boolean;
}
export function TaskList({
  tasks,
  onTaskSelect,
  selectedTaskId,
  focusNewTaskInput = false
}: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const {
    addTask,
    isLoading,
    error
  } = useTaskContext();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Focus the input when focusNewTaskInput is true
    if (focusNewTaskInput && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [focusNewTaskInput]);
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      await addTask(newTaskTitle);
      setNewTaskTitle("");
      toast.success("Task added successfully");
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  // Show loading state while tasks are being fetched
  if (isLoading) {
    return <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>;
  }

  // Show error state if task fetching failed
  if (error) {
    return <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load tasks. Please try refreshing the page.
        </AlertDescription>
      </Alert>;
  }

  // Filter tasks after loading is complete
  const upcomingTasks = tasks?.filter(task => !task.completed) || [];
  const completedTasks = tasks?.filter(task => task.completed) || [];
  return <div className="space-y-4">
      <Tabs defaultValue="upcoming" className="w-full py-0">
        <TaskListHeader upcomingCount={upcomingTasks.length} completedCount={completedTasks.length} />
        <TabsContent value="upcoming" className="mt-4">
          <TaskListContent tasks={upcomingTasks} editingTaskId={editingTaskId} selectedTaskId={selectedTaskId} onTaskSelect={onTaskSelect} onEditStart={id => setEditingTaskId(id)} onEditCancel={() => setEditingTaskId(null)} onEditSave={() => setEditingTaskId(null)} />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <TaskListContent tasks={completedTasks} editingTaskId={editingTaskId} selectedTaskId={selectedTaskId} onTaskSelect={onTaskSelect} onEditStart={id => setEditingTaskId(id)} onEditCancel={() => setEditingTaskId(null)} onEditSave={() => setEditingTaskId(null)} />
        </TabsContent>
        <AddTaskInput value={newTaskTitle} onChange={setNewTaskTitle} onSubmit={handleAddTask} inputRef={inputRef} />
      </Tabs>
    </div>;
}