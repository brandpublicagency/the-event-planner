
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DocumentDeleteDialogProps {
  documentId: string;
  documentTitle: string;
  onDeleteComplete?: () => void;
  isButton?: boolean;
}

export function DocumentDeleteDialog({ 
  documentId, 
  documentTitle, 
  onDeleteComplete,
  isButton = true
}: DocumentDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      console.log("Deleting document:", documentId);
      
      const { error } = await supabase
        .from("documents")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", documentId)
        .is("deleted_at", null);

      if (error) {
        console.error("Delete error:", error);
        throw new Error(`Failed to delete document: ${error.message}`);
      }
      
      return documentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      
      toast({
        title: "Document deleted",
        description: `The document "${documentTitle || 'Untitled'}" has been deleted.`,
        position: "sidebar" // Set position to sidebar
      });
      
      if (onDeleteComplete) {
        onDeleteComplete();
      } else {
        navigate('/documents');
      }
      
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error("Delete mutation error:", error);
      
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
        position: "sidebar" // Set position to sidebar
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {isButton ? (
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5 h-8 px-2.5 min-w-[70px]"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5 text-zinc-500" />
            )}
            <span className="text-zinc-500">Delete</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-destructive transition-colors" />
            )}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Document</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this document? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              deleteMutation.mutate();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
