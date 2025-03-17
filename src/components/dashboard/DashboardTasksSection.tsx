
import { useTaskContext } from "@/contexts/TaskContext";
import { TaskList } from "@/components/TaskList";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus } from "lucide-react";

interface DashboardTasksSectionProps {
  selectedTaskId: string | null;
  onTaskSelect: (id: string) => void;
}

const DashboardTasksSection = ({ selectedTaskId, onTaskSelect }: DashboardTasksSectionProps) => {
  const navigate = useNavigate();
  const { tasks, isLoading: isTasksLoading } = useTaskContext();
  
  const upcomingTasks = tasks.filter(task => !task.completed);
  
  const handleTaskSelect = (id: string) => {
    onTaskSelect(id);
    navigate(`/tasks?selected=${id}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 rounded-xl mb-4 relative" style={{
        backgroundImage: 'url(https://www.warmkaroo.com/wp-content/uploads/2025/03/WK-Profile.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: '15px'
      }}>
        <div className="absolute inset-0 bg-white/75 rounded-xl"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <CheckSquare className="h-5 w-5 text-zinc-700" />
          <h3 className="text-lg font-medium text-zinc-900">Upcoming Tasks</h3>
        </div>
        <Button 
          onClick={() => navigate('/tasks?newTask=true')} 
          size="sm" 
          variant="outline" 
          className="rounded-full relative z-10"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Task
        </Button>
      </div>
      <TaskList 
        tasks={upcomingTasks} 
        onTaskSelect={handleTaskSelect} 
        selectedTaskId={selectedTaskId} 
        hideHeader={true} 
        isDashboard={true} 
      />
    </div>
  );
};

export default DashboardTasksSection;
