
import React from "react";
import { Loader2 } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EventDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  isPermanentDelete: boolean;
  onPermanentDeleteChange: (isPermanent: boolean) => void;
  isDeleting: boolean;
  onDelete: (e: React.MouseEvent) => void;
}

export const EventDeleteDialog: React.FC<EventDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  eventName,
  isPermanentDelete,
  onPermanentDeleteChange,
  isDeleting,
  onDelete
}) => {
  return (
    <AlertDialogContent className="border-destructive/20 bg-background" onClick={e => e.stopPropagation()}>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-destructive">Delete Event</AlertDialogTitle>
        <AlertDialogDescription className="text-muted-foreground">
          <p className="mb-2">Are you sure you want to delete <span className="font-semibold">{eventName}</span>?</p>
          
          <div className="flex items-center space-x-2 bg-muted p-3 mt-3 rounded-md">
            <Switch 
              id="permanent-delete-action" 
              checked={isPermanentDelete}
              onCheckedChange={onPermanentDeleteChange}
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
        <AlertDialogCancel className="rounded-[5px]" onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
        <AlertDialogAction 
          onClick={onDelete} 
          className={`${isPermanentDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} rounded-[5px] text-white`}
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
  );
};
