import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FolderPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProjectCard from "@/components/ProjectCard";
import type { Event } from "@/types/event";

const Projects = () => {
  const projects: Event[] = [
    {
      event_code: "WR-2024-001",
      title: "Website Redesign",
      description: "Complete overhaul of the company website with modern design principles",
      progress: 75,
      teamSize: 4,
      dueDate: "2024-03-15",
      status: "Confirmed",
      event_type: "Project",
      venues: [{ name: "Main Office" }],
      pax: 4
    },
    {
      event_code: "MA-2024-001",
      title: "Mobile App Development",
      description: "Native mobile application for iOS and Android platforms",
      progress: 30,
      teamSize: 6,
      dueDate: "2024-04-20",
      status: "Tentative",
      event_type: "Project",
      venues: [{ name: "Tech Hub" }],
      pax: 6
    },
    {
      event_code: "BR-2024-001",
      title: "Brand Identity Update",
      description: "Refreshing the brand guidelines and visual identity",
      progress: 90,
      teamSize: 3,
      dueDate: "2024-02-28",
      status: "Confirmed",
      event_type: "Project",
      venues: [{ name: "Design Studio" }],
      pax: 3
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <Button>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-8" />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.event_code} {...project} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Projects;