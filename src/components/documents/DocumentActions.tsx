import { Button } from "@/components/ui/button";
import { FileDown, FileText, Trash2 } from "lucide-react";
import { Editor } from '@tiptap/react';
import { exportDocument } from "@/utils/documentUtils";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportAsPdf, exportAsDocx } from "@/utils/exportUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DocumentActionsProps {
  documentId: string;
  title: string;
  editor: Editor | null;
}

export function DocumentActions({ documentId, title, editor }: DocumentActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleExport = () => {
    if (!editor || !title) return;
    exportDocument(editor.getHTML(), title);
    toast({
      title: "Document exported",
      description: "Your document has been exported as HTML.",
    });
  };

  const handlePdfExport = async () => {
    if (!editor || !title) return;
    try {
      await exportAsPdf(editor.getHTML(), title);
      toast({
        title: "PDF exported",
        description: "Your document has been exported as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDocxExport = async () => {
    if (!editor || !title) return;
    try {
      await exportAsDocx(editor.getHTML(), title);
      toast({
        title: "DOCX exported",
        description: "Your document has been exported as DOCX.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export DOCX. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteDocument = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("documents")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Document deleted",
        description: "Your document has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteDocument.mutate();
    }
  };

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExport}>
            <FileText className="h-4 w-4 mr-2" />
            Export as HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePdfExport}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDocxExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Export as DOCX
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
}