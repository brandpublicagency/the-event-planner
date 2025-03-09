
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  name: string;
  type: string;
  date?: string;
  client?: string;
  company?: string;
  venue?: string;
  updated?: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all upcoming events
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .is('deleted_at', null)
          .is('completed', false)
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true });
        
        if (error) throw error;
        
        // Process events into projects
        const processedProjects: Project[] = events.map(event => {
          let clientName = '';
          
          // Handle client name based on event type
          if (event.event_type === 'Wedding') {
            clientName = event.primary_name || '';
            if (event.secondary_name) {
              clientName += clientName ? ` & ${event.secondary_name}` : event.secondary_name;
            }
          } else {
            clientName = event.primary_name || '';
            if (event.company) {
              clientName = event.company + (clientName ? ` (${clientName})` : '');
            }
          }
          
          return {
            id: event.event_code,
            name: event.name,
            type: event.event_type,
            date: event.event_date,
            client: clientName,
            company: event.company || undefined,
            venue: Array.isArray(event.venues) && event.venues.length > 0 ? event.venues[0] : undefined,
            updated: event.updated_at 
              ? formatDistanceToNow(new Date(event.updated_at), { addSuffix: true })
              : undefined
          };
        });
        
        setProjects(processedProjects);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const handleAddProject = () => {
    navigate('/new-event');
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/events/${projectId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Button onClick={handleAddProject}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-1/3 mb-2" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-700 mb-1">No upcoming projects</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first project</p>
          <Button onClick={handleAddProject}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default Projects;
