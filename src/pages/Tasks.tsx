import { TaskBoard } from "@/components/tasks/TaskBoard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewTaskForm } from "@/components/tasks/NewTaskForm";
import { useSearchParams } from "react-router-dom";

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const selected = searchParams.get("selected");
    if (selected) {
      setSelectedTaskId(selected);
    }
  }, [searchParams]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage and track your team's tasks efficiently</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <NewTaskForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <TaskBoard initialSelectedTaskId={selectedTaskId} />
    </div>
  );
};

export default Tasks;