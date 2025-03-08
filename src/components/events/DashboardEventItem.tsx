
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
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
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";

interface DashboardEventItemProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
}

export const DashboardEventItem: React.FC<DashboardEventItemProps> = ({ event, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between items-start p-3 hover:bg-zinc-50">
      <button
        onClick={() => navigate(`/events/${event.event_code}`)}
        className="text-left flex-1"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <span className="text-xs font-medium text-zinc-900">
              {event.event_date ? format(new Date(event.event_date), 'dd MMMM') : 'No date'} - {event.name}
            </span>
          </div>
          <div className="text-xs text-zinc-500">
            {event.pax} Pax / {getVenueNames(event)}
          </div>
        </div>
      </button>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/events/${event.event_code}/edit`);
          }}
          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900"
        >
          <Pencil className="h-3 w-3" />
        </Button>
        
        {handleDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900"
              >
                <Trash className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Event</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this event? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(event.event_code)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};
