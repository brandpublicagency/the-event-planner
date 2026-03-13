
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

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        editor?.commands.focus('end');
      }
    };

    return (
      <div
        ref={ref}
        className="document-content flex-1 min-h-[500px] cursor-text"
        onClick={handleClick}
      >
        <EditorContent
          editor={editor}
          className="h-full max-w-none focus:outline-none"
        />
      </div>
    );
  }
);

DocumentContent.displayName = 'DocumentContent';
