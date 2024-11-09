import { Target, ListTodo, Users, Rocket } from "lucide-react";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import TaskList from "@/components/TaskList";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMetricClick = (metric: string) => {
    toast({
      title: `${metric} clicked`,
      description: `You clicked on the ${metric} metric.`,
    });
  };

  const projects = [
    {
      title: "Website Redesign",
      description: "Complete overhaul of the company website with modern design",
      progress: 75,
      teamSize: 4,
      dueDate: "2024-03-15",
    },
    {
      title: "Mobile App Development",
      description: "Native mobile app for iOS and Android platforms",
      progress: 30,
      teamSize: 6,
      dueDate: "2024-04-01",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Projects"
              value={12}
              icon={<Target className="h-5 w-5" />}
              trend={{ value: 8, isUpward: true }}
              onClick={() => handleMetricClick("Total Projects")}
            />
            <MetricCard
              title="Active Tasks"
              value={67}
              icon={<ListTodo className="h-5 w-5" />}
              trend={{ value: 12, isUpward: true }}
              onClick={() => handleMetricClick("Active Tasks")}
            />
            <MetricCard
              title="Team Members"
              value={24}
              icon={<Users className="h-5 w-5" />}
              onClick={() => handleMetricClick("Team Members")}
            />
            <MetricCard
              title="Completed Projects"
              value={128}
              icon={<Rocket className="h-5 w-5" />}
              trend={{ value: 4, isUpward: true }}
              onClick={() => handleMetricClick("Completed Projects")}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/tasks")}
                >
                  View All
                </Button>
              </div>
              <TaskList />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Active Projects</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/projects")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectCard key={project.title} {...project} onClick={() => toast({ title: `Project: ${project.title}`, description: "Opening project details." })} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;