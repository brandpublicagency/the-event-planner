import { TaskBoard } from "@/components/tasks/TaskBoard";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useEffect } from "react";
const Tasks = () => {
  const [searchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("selected");
  const newTask = searchParams.get("newTask");
  const navigate = useNavigate();

  // Pass the newTask parameter to TaskBoard
  return <div className="flex flex-col h-full">
      <Header pageTitle="Tasks" />
      
      <div className="flex-1 p-6 py-[5px] px-[25px]">
        <TaskBoard initialSelectedTaskId={selectedTaskId} showNewTaskInput={newTask === "true"} />
      </div>
    </div>;
};
export default Tasks;