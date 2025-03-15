
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Copy, Edit, Trash } from "lucide-react";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
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
  
  const eventDate = event.event_date ? new Date(event.event_date) : null;
  const formattedStartTime = event.start_time ? event.start_time.substring(0, 5) : "";
  
  // Extract day from date
  const day = eventDate ? format(eventDate, "d") : "";
  
  return (
    <div className="rounded-xl border border-zinc-100 bg-white mb-3 hover:border-zinc-200 transition-colors overflow-hidden shadow-sm">
      <button onClick={() => navigate(`/events/${event.event_code}`)} className="text-left w-full">
        <div className="flex items-stretch w-full">
          {/* Date column */}
          <div className="flex flex-col items-center justify-center w-[80px] py-4 px-4 text-center border-r border-zinc-50">
            <div className="text-[32px] font-semibold text-zinc-800 leading-none">{day}</div>
            <div className="text-xs text-zinc-500 mt-1">{formattedStartTime}</div>
          </div>
          
          {/* Content column */}
          <div className="flex-1 py-3 px-5">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3 mt-3">
                <h4 className="font-medium text-zinc-900 text-base">{event.name}</h4>
                
                <div className="flex items-center gap-2">
                  <div 
                    className="text-xs text-zinc-500 flex items-center gap-1 cursor-pointer hover:text-zinc-700"
                    onClick={copyEventCode}>
                    <span>EVENT-{event.event_code}</span>
                    <Copy className="h-3.5 w-3.5 opacity-70" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-zinc-500 -mt-3">
                <div className="flex items-center">
                  {venueStr && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-zinc-400" />
                      <span className="truncate">{venueStr}</span>
                    </div>
                  )}
                </div>
                
                {event.pax && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1.5 flex-shrink-0 text-zinc-400" />
                    <span>{event.pax} guests</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center px-3 border-l border-zinc-50">
            <Button variant="ghost" size="icon" onClick={e => {
              e.stopPropagation();
              navigate(`/events/${event.event_code}/edit`);
            }} className="h-8 w-8 rounded-full">
              <Edit className="h-4 w-4 text-zinc-400" />
            </Button>
            
            {handleDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 w-8 rounded-full"
                  >
                    <Trash className="h-4 w-4 text-zinc-400" />
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
