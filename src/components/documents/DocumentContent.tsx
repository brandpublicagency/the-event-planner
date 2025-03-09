
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
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="bg-white rounded-lg border p-4 min-h-[300px] mb-4 flex-1">
          <EditorContent 
            editor={editor} 
            className="min-h-[300px]"
          />
        </div>
      </div>
    </>
  );
}
