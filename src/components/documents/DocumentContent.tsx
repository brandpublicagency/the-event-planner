
import { Editor, EditorContent } from '@tiptap/react';
import { forwardRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentContentProps {
  editor: Editor | null;
}

export const DocumentContent = forwardRef<HTMLDivElement, DocumentContentProps>(
  ({ editor }, ref) => {
    useEffect(() => {
      if (editor && !editor.isDestroyed) {
        setTimeout(() => {
          editor.commands.focus('end');
        }, 100);
      }
    }, [editor]);

    if (!editor) {
      return (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      );
    }

    return (
      <div ref={ref} className="document-content min-h-[200px]">
        <EditorContent
          editor={editor}
          className="h-full max-w-none focus:outline-none"
        />
      </div>
    );
  }
);

DocumentContent.displayName = 'DocumentContent';
