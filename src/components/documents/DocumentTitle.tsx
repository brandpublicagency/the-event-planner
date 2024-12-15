import { Input } from "@/components/ui/input";
import { DocumentActions } from "./DocumentActions";
import { Editor } from '@tiptap/react';

interface DocumentTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  documentId: string;
  editor: Editor | null;
}

export function DocumentTitle({ 
  title, 
  onTitleChange, 
  documentId, 
  editor 
}: DocumentTitleProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Untitled"
        className="text-lg font-medium bg-transparent border-none h-auto px-0 focus-visible:ring-0"
      />
      <DocumentActions
        documentId={documentId}
        title={title}
        editor={editor}
      />
    </div>
  );
}