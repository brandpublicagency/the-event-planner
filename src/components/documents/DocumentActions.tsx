import { Button } from "@/components/ui/button";
import { FileDown, FileUp, Loader2, Save } from "lucide-react";
import { Editor } from '@tiptap/react';
import { exportDocument, importDocument } from "@/utils/documentUtils";
import { useToast } from "@/components/ui/use-toast";

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
      description: "Your document has been exported successfully.",
    });
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
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
      >
        <FileDown className="h-4 w-4 mr-2" />
        Export
      </Button>
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