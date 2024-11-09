import { CheckSquare, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Design new dashboard layout",
    status: "in_progress",
    priority: "high",
    dueDate: "2024-02-01",
  },
  {
    id: "2",
    title: "Implement authentication flow",
    status: "todo",
    priority: "medium",
    dueDate: "2024-02-03",
  },
  // Add more tasks as needed
];

const TaskList = () => {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Tasks</h2>
      </div>
      <div className="divide-y">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">{task.title}</div>
                <div className="mt-1 text-sm text-gray-500">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                {task.priority}
              </Badge>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;