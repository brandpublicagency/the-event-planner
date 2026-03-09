
import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
import type { Event } from "@/types/event";

interface DeleteEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onDelete: () => Promise<void>;
  isPermanentDelete: boolean;
  onPermanentDeleteChange: (value: boolean) => void;
  isDeleting: boolean;
}

export const DeleteEventDialog: React.FC<DeleteEventDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
  onDelete,
  isPermanentDelete,
  onPermanentDeleteChange,
  isDeleting
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-4">
              This will delete the event "
              {event?.name || "Unknown Event"}".
            </p>
            
            <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
              <Switch 
                id="permanent-delete" 
                checked={isPermanentDelete}
                onCheckedChange={onPermanentDeleteChange}
              />
              <Label htmlFor="permanent-delete" className="font-medium text-red-600">
                Permanently delete from database
              </Label>
            </div>
            
            {isPermanentDelete ? (
              <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
                <p className="font-semibold mb-1">Warning: This is permanent!</p>
                <p className="text-sm">
                  This will completely remove the event and all associated data from the database.
                  This action cannot be undone.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                The event will be marked as deleted but can be recovered from the database if needed.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            disabled={isDeleting}
            className={`${isPermanentDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-destructive hover:bg-destructive/90'} text-destructive-foreground`}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isPermanentDelete ? 'Permanently Deleting...' : 'Deleting...'}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-1" />
                {isPermanentDelete ? 'Permanently Delete' : 'Delete'}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
