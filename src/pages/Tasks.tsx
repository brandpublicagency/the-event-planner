import { TaskProvider } from "@/contexts/TaskContext";
import { TaskList } from "@/components/tasks/TaskList";

const Tasks = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <TaskProvider>
          <TaskList />
        </TaskProvider>
      </div>
    </div>
  );
};

export default Tasks;