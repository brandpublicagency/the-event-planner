import { Editor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";

interface DocumentContentProps {
  editor: Editor | null;
}

export function DocumentContent({ editor }: DocumentContentProps) {
  if (!editor) return null;

  return (
    <>
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-white border rounded-lg">
        <EditorContent 
          editor={editor} 
          className="min-h-[500px] p-4" 
        />
      </div>
    </>
  );
}