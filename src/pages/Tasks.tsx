import { TaskBoard } from "@/components/tasks/TaskBoard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewTaskForm } from "@/components/tasks/NewTaskForm";

const Tasks = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your team's tasks efficiently
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
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

      <TaskBoard />
    </div>
  );
};

export default Tasks;