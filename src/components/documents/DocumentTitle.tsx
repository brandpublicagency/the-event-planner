import { Input } from "@/components/ui/input";
import { DocumentActions } from "./DocumentActions";
import { Editor } from '@tiptap/react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface DocumentTitleProps {
  title: string;
  onTitleChange: (title: string) => void;
  documentId: string;
  editor: Editor | null;
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

export function DocumentTitle({ 
  title, 
  onTitleChange, 
  documentId, 
  editor,
  onSave,
  hasUnsavedChanges 
}: DocumentTitleProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex-1">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none hover:bg-secondary/20 focus-visible:bg-secondary/20 transition-colors"
          placeholder="Untitled Document"
        />
      </div>
      <div className="flex items-center gap-2">
        {hasUnsavedChanges && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}
        <DocumentActions documentId={documentId} title={title} editor={editor} />
      </div>
    </div>
  );
}