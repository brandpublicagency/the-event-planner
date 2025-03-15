
import { useState, useEffect, useRef } from "react";
import { Task } from "@/contexts/task/taskTypes";
import { Loader2, AlertCircle, CheckSquare } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TaskListContent } from "./tasks/list/TaskListContent";
import { AddTaskInput } from "./tasks/list/AddTaskInput";
import { TaskListHeader } from "./tasks/list/TaskListHeader";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (id: string) => void;
  selectedTaskId: string | null;
  focusNewTaskInput?: boolean;
  hideHeader?: boolean;
}

export function TaskList({
  tasks,
  onTaskSelect,
  selectedTaskId,
  focusNewTaskInput = false,
  hideHeader = false
}: TaskListProps) {
  const navigate = useNavigate();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
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

  const filteredTasks = tasks.filter(task => {
    if (activeTab === "upcoming") {
      return !task.completed;
    } else {
      return task.completed;
    }
  });

  const upcomingCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

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

  return (
    <div className="space-y-4">
      {!hideHeader && (
        <div className="flex items-center justify-between p-4 border-b rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-zinc-700" />
            <h3 className="text-lg font-medium text-zinc-900">Tasks</h3>
          </div>
          <Button onClick={() => navigate('/tasks?newTask=true')} size="sm" variant="outline" className="rounded-full">
            <Plus className="h-4 w-4 mr-1.5" />
            New Task
          </Button>
        </div>
      )}
      
      <TaskListHeader 
        upcomingCount={upcomingCount} 
        completedCount={completedCount}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="mt-2">
        <TaskListContent 
          tasks={filteredTasks} 
          editingTaskId={editingTaskId} 
          selectedTaskId={selectedTaskId} 
          onTaskSelect={onTaskSelect} 
          onEditStart={id => setEditingTaskId(id)} 
          onEditCancel={() => setEditingTaskId(null)} 
          onEditSave={() => setEditingTaskId(null)} 
        />
      </div>
      
      {activeTab === "upcoming" && (
        <AddTaskInput 
          value={newTaskTitle} 
          onChange={setNewTaskTitle} 
          onSubmit={handleAddTask} 
          inputRef={inputRef} 
        />
      )}
    </div>
  );
}
