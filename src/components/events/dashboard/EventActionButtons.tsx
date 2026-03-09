
import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EventDeleteDialog } from "./EventDeleteDialog";
import { useEventDeleteState } from "./useEventDeleteState";

interface EventActionButtonsProps {
  eventCode: string;
  eventName: string;
  handleDelete?: (eventCode: string, isPermanent?: boolean) => Promise<void>;
}

export const EventActionButtons: React.FC<EventActionButtonsProps> = ({
  eventCode,
  eventName,
  handleDelete
}) => {
  const navigate = useNavigate();
  const {
    isDeleting,
    setIsDeleting,
    isPermanentDelete,
    setIsPermanentDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
  } = useEventDeleteState();

  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!handleDelete) return;
    
    try {
      setIsDeleting(true);
      await handleDelete(eventCode, isPermanentDelete);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col justify-center px-3 border-l border-border">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={e => {
          e.stopPropagation();
          navigate(`/events/${eventCode}/edit`);
        }} 
        className="mb-1"
      >
        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={e => e.stopPropagation()} 
            className=""
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
            ) : (
              <Trash className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        </AlertDialogTrigger>
        
        <EventDeleteDialog 
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          eventName={eventName}
          isPermanentDelete={isPermanentDelete}
          onPermanentDeleteChange={setIsPermanentDelete}
          isDeleting={isDeleting}
          onDelete={onDelete}
        />
      </AlertDialog>
    </div>
  );
};
