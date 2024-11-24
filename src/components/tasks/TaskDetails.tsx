import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, MessageSquare, Paperclip, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { TaskComments } from "./TaskComments";
import { TaskFiles } from "./TaskFiles";
import { TaskNotes } from "./TaskNotes";

interface TaskDetailsProps {
  taskId: string;
  onClose: () => void;
}

export function TaskDetails({ taskId, onClose }: TaskDetailsProps) {
  const { tasks } = useTaskContext();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return null;

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between p-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <Badge variant="outline">{task.task_code}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            {task.due_date && (
              <span>Due {format(new Date(task.due_date), "MMM d, yyyy")}</span>
            )}
            {task.priority && (
              <Badge variant="secondary" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                {task.priority}
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="comments" className="flex-1">
        <TabsList className="p-4">
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="comments" className="flex-1 p-4">
          <TaskComments taskId={taskId} />
        </TabsContent>
        <TabsContent value="files" className="flex-1 p-4">
          <TaskFiles taskId={taskId} />
        </TabsContent>
        <TabsContent value="notes" className="flex-1 p-4">
          <TaskNotes taskId={taskId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}