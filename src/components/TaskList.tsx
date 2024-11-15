import { Check, Clock, MoreHorizontal, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-zinc-600 bg-zinc-50 border-zinc-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <Check className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "canceled":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-white border border-zinc-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">Tasks</CardTitle>
        <Badge variant="outline" className="text-xs">
          {tasks.length} total
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-zinc-100">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group relative flex items-center gap-x-4 px-4 py-3 hover:bg-zinc-50 transition-all duration-200"
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-zinc-400">{task.id}</span>
                  <Badge 
                    variant="outline" 
                    className="text-[10px] py-0 px-1.5 font-medium capitalize"
                  >
                    {task.type}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-zinc-900 line-clamp-2">
                  {task.title}
                </h3>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={`text-[10px] py-0.5 px-2 font-medium capitalize flex items-center gap-1 ${
                        task.status === "done" ? "bg-green-50 text-green-600 border-green-200" : ""
                      }`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={`text-[10px] py-0.5 px-2 font-medium capitalize ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-100 rounded">
                    <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem>Change Status</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;