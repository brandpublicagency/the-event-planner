
import { Editor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { forwardRef } from 'react';

interface DocumentContentProps {
  editor: Editor | null;
}

export const DocumentContent = forwardRef<HTMLDivElement, DocumentContentProps>(
  ({ editor }, ref) => {
    if (!editor) return null;

    return (
      <div className="flex flex-col h-full">
        <EditorToolbar editor={editor} />
        <div className="flex-1 overflow-hidden">
          <div ref={ref} className="bg-white rounded-lg border h-full overflow-y-auto flex flex-col print-document">
            <EditorContent 
              editor={editor} 
              className="flex-1 p-4 h-full"
            />
          </div>
        </div>
      </div>
    );
  }
);

DocumentContent.displayName = 'DocumentContent';
