
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { MapPin, Users, Copy, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";
import { Link } from "react-router-dom";
import { getVenueNames } from "@/utils/venueUtils";
import { useCopyEventCode } from "./utils/eventCodeUtils";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Trash } from "lucide-react";

interface EventCardProps {
  event: Event;
  handleDelete?: (eventCode: string, isPermanent?: boolean) => Promise<void>;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (handleDelete) {
        await handleDelete(event_code, isPermanentDelete);
      } else if (onDelete) {
        onDelete(event);
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
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
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-0"
                >
                  <Edit className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              
              {onView && (
                <Button
                  onClick={handleViewClick}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-0"
                >
                  <Eye className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="sr-only">View</span>
                </Button>
              )}
              
              {(handleDelete || onDelete) && (
                <Button
                  onClick={handleDeleteClick}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-0"
                >
                  <Trash className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="sr-only">Delete</span>
                </Button>
              )}
            </>
          )}
          
          {isDashboard && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0"
              onClick={handleViewClick}
            >
              <Eye className="h-3.5 w-3.5 text-zinc-400" />
              <span className="sr-only">View event</span>
            </Button>
          )}
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-red-100 bg-white" onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Event</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600">
              <p className="mb-2">Are you sure you want to delete <span className="font-semibold">{name}</span>?</p>
              
              <div className="flex items-center space-x-2 bg-gray-50 p-3 mt-3 rounded-md">
                <Switch 
                  id={`permanent-delete-${event_code}`}
                  checked={isPermanentDelete}
                  onCheckedChange={setIsPermanentDelete}
                />
                <Label htmlFor={`permanent-delete-${event_code}`} className="font-medium text-red-600">
                  Permanently delete from database
                </Label>
              </div>
              
              {isPermanentDelete ? (
                <div className="bg-red-50 p-3 rounded-md border border-red-100 my-2">
                  <p className="text-red-800 text-sm font-semibold">This action cannot be undone.</p>
                  <p className="text-red-800 text-sm">The event and all associated data will be permanently deleted from the database.</p>
                </div>
              ) : (
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100 my-2">
                  <p className="text-amber-800 text-sm">The event will be soft-deleted and can be recovered if needed.</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-full" onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={e => {
                e.stopPropagation();
                confirmDelete();
              }}
              className={`${isPermanentDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} rounded-full text-white`}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isPermanentDelete ? 'Permanently Deleting...' : 'Deleting...'}
                </>
              ) : isPermanentDelete ? 'Permanently Delete' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
