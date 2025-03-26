
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash, Loader2 } from "lucide-react";
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
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EventActionsColumnProps {
  eventCode: string;
  eventName: string;
  handleDelete?: (eventCode: string, isPermanent?: boolean) => Promise<void>;
}

export const EventActionsColumn: React.FC<EventActionsColumnProps> = ({ 
  eventCode, 
  eventName, 
  handleDelete 
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const onDelete = async () => {
    if (!handleDelete) return;
    
    try {
      setIsDeleting(true);
      await handleDelete(eventCode, isPermanentDelete);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center px-3 border-l border-zinc-50">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={e => {
          e.stopPropagation();
          navigate(`/events/${eventCode}/edit`);
        }} 
        className="h-7 w-7 rounded-full mb-1"
      >
        <Edit className="h-3.5 w-3.5 text-zinc-400" />
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={e => e.stopPropagation()} 
            className="h-7 w-7 rounded-full"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 text-zinc-400 animate-spin" />
            ) : (
              <Trash className="h-3.5 w-3.5 text-zinc-400" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-red-100 bg-white" onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Event</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600">
              <p className="mb-2">Are you sure you want to delete <span className="font-semibold">{eventName}</span>?</p>
              
              <div className="flex items-center space-x-2 bg-gray-50 p-3 mt-3 rounded-md">
                <Switch 
                  id="permanent-delete-action" 
                  checked={isPermanentDelete}
                  onCheckedChange={setIsPermanentDelete}
                />
                <Label htmlFor="permanent-delete-action" className="font-medium text-red-600">
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
                onDelete();
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
