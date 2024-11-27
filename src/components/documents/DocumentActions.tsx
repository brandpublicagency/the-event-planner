import { Button } from "@/components/ui/button";
import { FileDown, FileUp, Loader2, Save, FileText } from "lucide-react";
import { Editor } from '@tiptap/react';
import { exportDocument, importDocument } from "@/utils/documentUtils";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportAsPdf, exportAsDocx } from "@/utils/exportUtils";

interface DocumentActionsProps {
  title: string;
  editor: Editor | null;
  onSave: () => void;
  isSaving: boolean;
}

export function DocumentActions({ title, editor, onSave, isSaving }: DocumentActionsProps) {
  const { toast } = useToast();

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

  const handleImport = () => {
    if (!editor) return;
    importDocument((content) => {
      editor.commands.setContent(content);
      toast({
        title: "Document imported",
        description: "Your document has been imported successfully.",
      });
    });
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
        onClick={handleImport}
      >
        <FileUp className="h-4 w-4 mr-2" />
        Import
      </Button>
      <Button
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        <span className="ml-2">Save</span>
      </Button>
    </div>
  );
}