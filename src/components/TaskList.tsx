import { Check, Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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
  // Add more tasks as needed
];

const TaskList = () => {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-medium">Tasks</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">Status</Badge>
              <Badge variant="outline" className="text-xs">Priority</Badge>
            </div>
          </div>
          <button className="text-xs text-zinc-500 hover:text-zinc-900">View</button>
        </div>
      </div>
      <div className="divide-y divide-zinc-200">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center px-4 py-3 hover:bg-zinc-50">
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
      <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
        <span className="text-xs text-zinc-500">0 of 100 row(s) selected.</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Rows per page</span>
          <select className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskList;