import { Target, ListTodo, Users, Rocket } from "lucide-react";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import TaskList from "@/components/TaskList";
import ProjectCard from "@/components/ProjectCard";

const Index = () => {
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
            />
            <MetricCard
              title="Active Tasks"
              value={67}
              icon={<ListTodo className="h-5 w-5" />}
              trend={{ value: 12, isUpward: true }}
            />
            <MetricCard
              title="Team Members"
              value={24}
              icon={<Users className="h-5 w-5" />}
            />
            <MetricCard
              title="Completed Projects"
              value={128}
              icon={<Rocket className="h-5 w-5" />}
              trend={{ value: 4, isUpward: true }}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Tasks</h2>
              <TaskList />
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Active Projects</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectCard key={project.title} {...project} />
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