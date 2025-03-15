
import { Editor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";

interface DocumentContentProps {
  editor: Editor | null;
}

export function DocumentContent({ editor }: DocumentContentProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-hidden">
        <div className="bg-white rounded-lg border h-full overflow-y-auto flex flex-col">
          <EditorContent 
            editor={editor} 
            className="flex-1 p-4 h-full"
          />
        </div>
      </div>
    </div>
  );
}
