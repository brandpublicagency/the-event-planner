
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Copy, Edit, Trash } from "lucide-react";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DashboardEventItemProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
}

export const DashboardEventItem: React.FC<DashboardEventItemProps> = ({
  event,
  handleDelete
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const venueStr = getVenueNames(event);
  
  const copyEventCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(event.event_code).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `Event code ${event.event_code} copied to clipboard`,
        duration: 3000
      });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy event code to clipboard",
        duration: 3000
      });
    });
  };
  
  const isToday = event.event_date && new Date(event.event_date).toDateString() === new Date().toDateString();
  
  return (
    <div className="border border-zinc-100 rounded-lg mb-2 hover:border-zinc-200 transition-colors">
      <button onClick={() => navigate(`/events/${event.event_code}`)} className="text-left w-full p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <span className={cn(
                "text-sm font-medium truncate mr-2", 
                isToday ? "text-blue-600" : "text-zinc-900"
              )}>
                {event.event_date ? format(new Date(event.event_date), 'dd MMM') : 'No date'} - {event.name}
              </span>
              
              <Badge variant="outline" 
                className="text-[10px] font-normal cursor-pointer hover:bg-white border-none py-0 h-5"
                onClick={copyEventCode}>
                {event.event_code}
                <Copy className="ml-1 h-2.5 w-2.5 opacity-70" />
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-500 mt-2">
              {venueStr && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{venueStr}</span>
                </div>
              )}
              
              {event.pax && (
                <div className="flex items-center ml-2">
                  <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{event.pax} guests</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={e => {
              e.stopPropagation();
              navigate(`/events/${event.event_code}/edit`);
            }} className="h-7 w-7 rounded-full">
              <Edit className="h-3.5 w-3.5 text-zinc-500" />
            </Button>
            
            {handleDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 w-7 rounded-full"
                  >
                    <Trash className="h-3.5 w-3.5 text-zinc-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-red-100 bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">Permanently Delete Event</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-600">
                      <p className="mb-2">Are you sure you want to delete <span className="font-semibold">{event.name}</span>?</p>
                      <div className="bg-red-50 p-3 rounded-md border border-red-100 my-2">
                        <p className="text-red-800 text-sm">This action cannot be undone. The event and all associated data will be permanently deleted from the database.</p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (handleDelete) {
                          handleDelete(event.event_code);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 rounded-full text-white"
                    >
                      Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};
