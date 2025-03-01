
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
import { Loader2, Trash2 } from "lucide-react";
import { FileActionButton } from "./FileActionButton";
import { useState } from "react";

interface FileDeleteDialogProps {
  isDeleting: boolean;
  onDelete: () => Promise<void>;
  disabled?: boolean;
}

export function FileDeleteDialog({ isDeleting, onDelete, disabled }: FileDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await onDelete();
      setOpen(false);
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <FileActionButton
          icon={isDeleting ? Loader2 : Trash2}
          disabled={disabled || isDeleting}
          variant="ghost"
          className={isDeleting ? "animate-spin" : ""}
        />
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete File</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this file? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
