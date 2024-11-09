import { Calendar, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  title: string;
  description: string;
  progress: number;
  teamSize: number;
  dueDate: string;
}

const ProjectCard = ({ title, description, progress, teamSize, dueDate }: ProjectCardProps) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="mt-2" />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{teamSize} members</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Due {new Date(dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;