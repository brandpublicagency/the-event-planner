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
      name: "Website Redesign",
      description: "Complete overhaul of the company website with modern design principles",
      event_type: "Project",
      event_date: "2024-03-15",
      pax: 4,
      package_id: null,
      client_address: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      event_venues: [{ venues: { name: "Main Office" } }]
    },
    {
      event_code: "MA-2024-001",
      name: "Mobile App Development",
      description: "Native mobile application for iOS and Android platforms",
      event_type: "Project",
      event_date: "2024-04-20",
      pax: 6,
      package_id: null,
      client_address: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      event_venues: [{ venues: { name: "Tech Hub" } }]
    },
    {
      event_code: "BR-2024-001",
      name: "Brand Identity Update",
      description: "Refreshing the brand guidelines and visual identity",
      event_type: "Project",
      event_date: "2024-02-28",
      pax: 3,
      package_id: null,
      client_address: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      event_venues: [{ venues: { name: "Design Studio" } }]
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
            <ProjectCard 
              key={project.event_code} 
              {...project} 
              progress={75} 
              teamSize={project.pax || 0}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Projects;