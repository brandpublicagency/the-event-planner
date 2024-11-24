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
    <div className="flex-1 h-full bg-background">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your team's tasks efficiently
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
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
    </div>
  );
};

export default Tasks;