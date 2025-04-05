
import { Editor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { forwardRef, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMentionHandler } from '@/hooks/mention/useMentionHandler';
import { InlineMentionSuggestions } from './InlineMentionSuggestion';

interface DocumentContentProps {
  editor: Editor | null;
}

export const DocumentContent = forwardRef<HTMLDivElement, DocumentContentProps>(({
  editor
}, ref) => {
  // Use our custom hooks for handling mentions and editor setup
  const { 
    mentionSuggestion, 
    handleSelect, 
    handleClose,
    searchAllEntities,
    isSearching
  } = useMentionHandler(editor);

  // Handle key events at the component level
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === '/') {
      console.log('Slash key detected in DocumentContent');
    }
  }, []);

  // Debug mentions system
  useEffect(() => {
    if (editor) {
      console.log('DocumentContent: Editor initialized');
      
      // Log when user types '/'
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [editor, handleKeyDown]);

  if (!editor) {
    return (
      <div className="flex flex-col h-full gap-4">
        <div className="h-10 w-full">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 rounded-lg border h-full overflow-y-auto">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-hidden relative">
        <div ref={ref} className="bg-white rounded-md border border-zinc-200 h-full overflow-y-auto flex flex-col print-document">
          <EditorContent editor={editor} className="flex-1 p-3 h-full prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none px-[25px] document-content" />
          
          {/* Inline Mention Suggestions */}
          {mentionSuggestion.active && (
            <InlineMentionSuggestions
              query={mentionSuggestion.query}
              onSelect={handleSelect}
              onClose={handleClose}
              position={mentionSuggestion.position}
              searchAllEntities={searchAllEntities}
              isSearching={isSearching}
            />
          )}
        </div>
      </div>
    </div>
  );
});

DocumentContent.displayName = 'DocumentContent';
