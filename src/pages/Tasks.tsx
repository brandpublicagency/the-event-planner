
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";

const Tasks = () => {
  const [searchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("selected");

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        contextTitle="Task Management"
        pageTitle="Tasks"
        subtitle="Manage and track your team's tasks efficiently"
      />
      
      <div className="flex-1 p-6">
        <TaskBoard initialSelectedTaskId={selectedTaskId} />
      </div>
    </div>
  );
};

export default Tasks;
