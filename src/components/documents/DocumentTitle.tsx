
import { Input } from "@/components/ui/input";
import { DocumentActions } from "./DocumentActions";
import { Editor } from '@tiptap/react';
import { Document } from '@/types/document';

export interface DocumentTitleProps {
  title: string;
  onTitleChange?: (title: string) => void;
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
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex-1">
        <Input
          value={title}
          onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none hover:bg-secondary/20 focus-visible:bg-secondary/20 transition-colors"
          placeholder="Untitled Document"
        />
      </div>
      <DocumentActions 
        document={{
          id: documentId,
          title: title,
          content: null,
          user_id: '', // Required by Document type
          template: null,
          created_at: '', // Required by Document type
          updated_at: '', // Required by Document type
          deleted_at: null
        }}
        content={editor?.getHTML() || ''}
      />
    </div>
  );
}
