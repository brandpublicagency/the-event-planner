
import React from "react";
import { format, parseISO } from "date-fns";
import { MapPin, Users, Copy, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";
import { Link } from "react-router-dom";
import { getVenueNames } from "@/utils/venueUtils";
import { useCopyEventCode } from "./utils/eventCodeUtils";

interface EventCardProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
  onEdit?: (eventCode: string) => void;
  onView?: (eventCode: string) => void;
  onDelete?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  handleDelete,
  isDashboard = false,
  onEdit,
  onView,
  onDelete
}) => {
  const { name, event_type, event_date, pax, event_code } = event;
  const copyEventCode = useCopyEventCode();
  
  const formattedDate = event_date ? format(parseISO(event_date), 'EEE, MMM d, yyyy') : 'No date set';
  const venueStr = getVenueNames(event);
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(event_code);
  };
  
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) onView(event_code);
  };
  
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handleDelete) {
      await handleDelete(event_code);
    } else if (onDelete) {
      onDelete(event);
    }
  };
  
  return (
    <div className="p-3 hover:bg-gray-50 transition-colors w-full">
      <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start w-full">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center">
            <h4 className="font-medium text-zinc-900 text-sm">
              <Link 
                to={`/events/${event_code}`} 
                className="hover:text-primary cursor-pointer"
              >
                {name}
              </Link>
            </h4>
            <div 
              className="ml-2 text-[10px] text-zinc-500 flex items-center gap-1 cursor-pointer hover:text-zinc-700" 
              onClick={(e) => copyEventCode(event_code, e)}
            >
              <span className="text-[10px] opacity-70">EVENT-{event_code}</span>
              <Copy className="h-2.5 w-2.5 opacity-70" />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500 mt-1">
            <div className="flex items-center">
              <span className="text-[11px]">{formattedDate}</span>
            </div>
            
            {event_type && (
              <div className="flex items-center">
                <span className="text-[11px]">{event_type}</span>
              </div>
            )}
            
            {pax && (
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1 text-zinc-400" />
                <span className="text-[11px]">{pax} guests</span>
                
                {venueStr && venueStr !== 'No venues selected' && (
                  <>
                    <span className="mx-1 text-zinc-300">•</span>
                    <MapPin className="h-3 w-3 mr-1 text-zinc-400" />
                    <span className="text-[11px]">{venueStr}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-1 justify-end">
          {!isDashboard && (
            <>
              {onEdit && (
                <Button
                  onClick={handleEditClick}
                  variant="default"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  Edit
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              
              {onView && (
                <Button
                  onClick={handleViewClick}
                  variant="default"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  View
                  <span className="sr-only">View</span>
                </Button>
              )}
              
              {(handleDelete || onDelete) && (
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  Delete
                  <span className="sr-only">Delete</span>
                </Button>
              )}
            </>
          )}
          
          {isDashboard && (
            <Button
              variant="default"
              size="sm"
              className="h-7 rounded-full p-0 w-7 text-white"
              onClick={handleViewClick}
            >
              View
              <span className="sr-only">View event</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
