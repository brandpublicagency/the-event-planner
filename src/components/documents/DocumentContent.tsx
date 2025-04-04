
import { Editor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { forwardRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentContentProps {
  editor: Editor | null;
}

export const DocumentContent = forwardRef<HTMLDivElement, DocumentContentProps>(({
  editor
}, ref) => {
  // Force editor focus when it becomes available
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      setTimeout(() => {
        editor.commands.focus('end');
      }, 100);
    }
  }, [editor]);

  if (!editor) {
    return <div className="flex flex-col h-full gap-4">
          <div className="h-10 w-full">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1 rounded-lg border h-full overflow-y-auto">
            <Skeleton className="h-full w-full" />
          </div>
        </div>;
  }

  return <div className="flex flex-col h-full">
        <EditorToolbar editor={editor} />
        <div className="flex-1 overflow-hidden">
          <div ref={ref} className="bg-white rounded-md border border-zinc-200 h-full overflow-y-auto flex flex-col print-document">
            <EditorContent editor={editor} className="flex-1 p-3 h-full prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none px-[25px] document-content" />
          </div>
        </div>
      </div>;
});

DocumentContent.displayName = 'DocumentContent';
