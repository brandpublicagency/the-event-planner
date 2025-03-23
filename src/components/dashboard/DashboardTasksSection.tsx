import { useTaskContext } from "@/contexts/TaskContext";
import { TaskList } from "@/components/TaskList";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus } from "lucide-react";
interface DashboardTasksSectionProps {
  selectedTaskId: string | null;
  onTaskSelect: (id: string) => void;
}
const DashboardTasksSection = ({
  selectedTaskId,
  onTaskSelect
}: DashboardTasksSectionProps) => {
  const navigate = useNavigate();
  const {
    tasks,
    isLoading: isTasksLoading
  } = useTaskContext();
  const upcomingTasks = tasks.filter(task => !task.completed);
  const handleTaskSelect = (id: string) => {
    onTaskSelect(id);
    navigate(`/tasks?selected=${id}`);
  };
  return <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 py-5 rounded-lg bg-gray-200">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-zinc-700" />
          <h3 className="text-lg font-medium text-zinc-900">Upcoming Tasks</h3>
        </div>
        <Button onClick={() => navigate('/tasks?newTask=true')} size="sm" variant="outline" className="rounded-full">
          <Plus className="h-4 w-4 mr-1.5" />
          New Task
        </Button>
      </div>
      <div className="p-1">
        <TaskList tasks={upcomingTasks} onTaskSelect={handleTaskSelect} selectedTaskId={selectedTaskId} hideHeader={true} isDashboard={true} />
      </div>
    </div>;
};
export default DashboardTasksSection;