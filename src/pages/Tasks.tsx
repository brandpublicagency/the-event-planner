import { TaskBoard } from "@/components/tasks/TaskBoard";
import { useSearchParams } from "react-router-dom";

const Tasks = () => {
  const [searchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("selected");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <p className="text-muted-foreground">Manage and track your team's tasks efficiently</p>
      </div>

      <TaskBoard initialSelectedTaskId={selectedTaskId} />
    </div>
  );
};

export default Tasks;