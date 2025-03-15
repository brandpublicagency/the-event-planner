import { useState, useEffect, useRef } from "react";
import { Task } from "@/contexts/task/taskTypes";
import { Loader2, AlertCircle, CheckSquare } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>;
  }

  if (error) {
    return <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load tasks. Please try refreshing the page.
        </AlertDescription>
      </Alert>;
  }

  const recentTasks = [...tasks].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 3);

  return (
    <div className="space-y-4">
      <div 
        className="flex items-center justify-between p-4 border-b rounded-xl mb-4 relative"
        style={{ 
          backgroundImage: 'url(https://www.warmkaroo.com/wp-content/uploads/2025/03/WK-Profile.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '15px'
        }}
      >
        <div className="absolute inset-0 bg-white/90 rounded-xl"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <CheckSquare className="h-5 w-5 text-zinc-700" />
          <h3 className="text-lg font-medium text-zinc-900">Upcoming Tasks</h3>
        </div>
      </div>
      
      <div className="mt-2">
        <TaskListContent 
          tasks={recentTasks} 
          editingTaskId={editingTaskId} 
          selectedTaskId={selectedTaskId} 
          onTaskSelect={onTaskSelect} 
          onEditStart={id => setEditingTaskId(id)} 
          onEditCancel={() => setEditingTaskId(null)} 
          onEditSave={() => setEditingTaskId(null)} 
        />
      </div>
      
      <AddTaskInput 
        value={newTaskTitle} 
        onChange={setNewTaskTitle} 
        onSubmit={handleAddTask} 
        inputRef={inputRef} 
      />
    </div>
  );
}
