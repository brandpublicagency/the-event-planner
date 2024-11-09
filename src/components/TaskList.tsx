import { Check, Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done" | "backlog" | "canceled";
  priority: "low" | "medium" | "high";
  type: "bug" | "feature" | "documentation";
  dueDate: string;
}

const tasks: Task[] = [
  {
    id: "TASK-8782",
    title: "Documentation: You can't compress the program without quantifying the open-source SSD",
    status: "in_progress",
    priority: "medium",
    type: "documentation",
    dueDate: "2024-02-01",
  },
  {
    id: "TASK-7878",
    title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
    status: "backlog",
    priority: "medium",
    type: "documentation",
    dueDate: "2024-02-03",
  },
];

const TaskList = () => {
  const { toast } = useToast();

  const handleTaskClick = (taskId: string) => {
    toast({
      title: `Task ${taskId} clicked`,
      description: "Opening task details.",
    });
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
        <Badge variant="outline" className="text-xs">
          {tasks.length} total
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-zinc-200">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center px-4 py-3 transition-all duration-700 hover:bg-gradient-to-r hover:from-white hover:via-zinc-50 hover:to-white cursor-pointer"
              onClick={() => handleTaskClick(task.id)}
            >
              <Checkbox className="mr-4" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">{task.id}</span>
                  <Badge variant="outline" className="text-xs capitalize">{task.type}</Badge>
                </div>
                <div className="mt-1 text-sm">{task.title}</div>
              </div>
              <div className="ml-4 flex items-center gap-3">
                <Badge 
                  variant={task.status === "done" ? "secondary" : "outline"}
                  className="text-xs capitalize"
                >
                  {task.status.replace('_', ' ')}
                </Badge>
                <Badge 
                  variant={task.priority === "high" ? "destructive" : "outline"}
                  className="text-xs capitalize"
                >
                  {task.priority}
                </Badge>
                <button className="text-zinc-400 hover:text-zinc-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;