import { useTaskContext } from "@/contexts/TaskContext";
import { TaskList } from "@/components/TaskList";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus, Edit, Eye } from "lucide-react";
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
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Upcoming Tasks</h3>
        </div>
        <Button onClick={() => navigate('/tasks?newTask=true')} size="sm" variant="outline" className="h-7 text-xs bg-background rounded-md px-2">
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