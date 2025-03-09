import React from "react";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getVenueNames } from "@/utils/venueUtils";

const projects = [
  {
    event_code: "EVENT-280123-1",
    name: "Smith Wedding",
    description: "Elegant wedding celebration",
    event_type: "Wedding",
    event_date: "2023-07-15",
    start_time: "16:00",
    end_time: "23:00",
    pax: 120,
    client_address: "123 Main St, Cape Town",
    created_at: "2023-01-28T10:00:00Z",
    updated_at: "2023-01-28T10:00:00Z",
    created_by: "user123",
    completed: false,
    deleted_at: null,
    venues: ["The Gallery", "The Grand Hall"],
  },
  {
    event_code: "EVENT-050223-2",
    name: "Tech Conference 2023",
    description: "Annual technology conference",
    event_type: "Conference",
    event_date: "2023-09-10",
    start_time: "08:00",
    end_time: "17:00",
    pax: 250,
    client_address: "456 Business Park, Johannesburg",
    created_at: "2023-02-05T14:30:00Z",
    updated_at: "2023-02-05T14:30:00Z",
    created_by: "user456",
    completed: false,
    deleted_at: null,
    venues: ["The Kitchen", "Package 1"],
  },
  {
    event_code: "EVENT-150323-3",
    name: "Annual Gala Dinner",
    description: "Charity fundraising event",
    event_type: "Corporate Event",
    event_date: "2023-11-25",
    start_time: "18:30",
    end_time: "23:30",
    pax: 180,
    client_address: "789 Luxury Ave, Durban",
    created_at: "2023-03-15T09:45:00Z",
    updated_at: "2023-03-15T09:45:00Z",
    created_by: "user789",
    completed: false,
    deleted_at: null,
    venues: ["The Grand Hall"],
  },
  {
    event_code: "EVENT-010423-4",
    name: "Birthday Bash",
    description: "A milestone birthday celebration",
    event_type: "Celebration",
    event_date: "2023-08-01",
    start_time: "19:00",
    end_time: "00:00",
    pax: 80,
    client_address: "321 Party Lane, Pretoria",
    created_at: "2023-04-01T16:20:00Z",
    updated_at: "2023-04-01T16:20:00Z",
    created_by: "user101",
    completed: false,
    deleted_at: null,
    venues: ["Package 2"],
  },
  {
    event_code: "EVENT-100523-5",
    name: "Product Launch",
    description: "Exciting new product reveal",
    event_type: "Corporate Event",
    event_date: "2023-12-05",
    start_time: "10:00",
    end_time: "16:00",
    pax: 300,
    client_address: "654 Innovation Rd, Cape Town",
    created_at: "2023-05-10T11:55:00Z",
    updated_at: "2023-05-10T11:55:00Z",
    created_by: "user202",
    completed: false,
    deleted_at: null,
    venues: ["The Kitchen", "The Gallery"],
  },
];

const Projects = () => {
  return (
    <ScrollArea className="w-full space-y-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.event_code} className="bg-secondary">
            <CardHeader>
              <CardTitle className="text-lg font-semibold leading-none tracking-tight">{project.name}</CardTitle>
              <CardDescription className="text-zinc-500">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-zinc-700">{project.event_date}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Clock className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-zinc-700">{project.start_time} - {project.end_time}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <MapPin className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-zinc-700">{project.client_address}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-zinc-700">
                  <Badge variant="secondary">{project.event_type}</Badge>
                </span>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-zinc-700">
                  Venues: {getVenueNames(project)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://avatar.vercel.sh/${project.created_by}.png`} alt={project.created_by} />
                <AvatarFallback>{project.created_by?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Created By</p>
                <p className="text-sm text-zinc-500">{project.created_by}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Projects;
