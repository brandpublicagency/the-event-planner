
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useEffect } from "react";

const Tasks = () => {
  const [searchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("selected");
  const newTask = searchParams.get("newTask");
  const navigate = useNavigate();

  // Pass the newTask parameter to TaskBoard
  return (
    <div className="flex flex-col h-full">
      <Header
        pageTitle="Tasks"
        actionButton={{
          label: "New Task",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => navigate("/tasks/new")
        }}
      />
      
      <div className="flex-1 p-6">
        <TaskBoard 
          initialSelectedTaskId={selectedTaskId} 
          showNewTaskInput={newTask === "true"} 
        />
      </div>
    </div>
  );
};

export default Tasks;
