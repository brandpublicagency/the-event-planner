
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, MoreVertical } from "lucide-react";

interface DocumentDeleteDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  documentId: string;
  documentTitle: string;
  onDocumentDeleted?: () => void;
  isButton?: boolean; // Add the missing property
}

export const DocumentDeleteDialog: React.FC<DocumentDeleteDialogProps> = ({
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  documentId,
  documentTitle,
  onDocumentDeleted,
  isButton = true, // Default to true for backward compatibility
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Use external or internal state based on props
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const onOpenChange = externalOnOpenChange || setInternalIsOpen;

  const handleDelete = async () => {
    if (!documentId) return;
    
    setIsDeleting(true);
    try {
      // Soft delete the document (update the deleted_at field)
      const { error } = await supabase
        .from("documents")
        .update({ 
          deleted_at: new Date().toISOString(),
          // Add any other fields that need to be updated on deletion
        })
        .eq("id", documentId);

      if (error) throw error;

      toast.success("Document deleted successfully", {
        duration: 3000,
      });
      
      if (onDocumentDeleted) onDocumentDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document", {
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // If external control is not provided, render with trigger
  if (externalIsOpen === undefined) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>
          {isButton ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 ml-auto"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the document "{documentTitle}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // If external control is provided, render without trigger
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the document "{documentTitle}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
