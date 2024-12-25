import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Trash2, Loader2 } from "lucide-react";
import { exportAsPdf, exportAsDocx } from "@/utils/exportUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { useNavigate } from "react-router-dom";

interface DocumentActionsProps {
  documentId: string;
  title: string;
  content: string;
}

export default function DocumentActions({ documentId, title, content }: DocumentActionsProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      if (format === 'pdf') {
        await exportAsPdf(title, content);
      } else {
        await exportAsDocx(title, content);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const deleteDocument = useMutation({
    mutationFn: async () => {
      console.log("Deleting document from actions:", documentId);
      
      const { data, error } = await supabase
        .from('documents')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', documentId)
        .is("deleted_at", null)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Delete error from actions:", error);
        throw new Error(`Failed to delete document: ${error.message}`);
      }

      if (!data) {
        throw new Error("Document not found or already deleted");
      }
      
      console.log("Document deleted successfully from actions");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      navigate('/documents');
    },
    onError: (error: Error) => {
      console.error('Delete error:', error);
    },
  });

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('docx')}>
            Export as DOCX
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            size="sm"
            className="gap-2"
            disabled={deleteDocument.isPending}
          >
            {deleteDocument.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {deleteDocument.isPending ? 'Deleting...' : 'Delete'}
          </Button>
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
              onClick={() => deleteDocument.mutate()}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteDocument.isPending}
            >
              {deleteDocument.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}