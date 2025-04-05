
import { Editor, EditorContent, Range } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { forwardRef, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MentionSelector } from './MentionSelector';
import { useMentionHandler } from '@/hooks/useMentionHandler';
import { useInlineMentionCommands } from '@/hooks/useInlineMentionCommands';

interface DocumentContentProps {
  editor: Editor | null;
}

export const DocumentContent = forwardRef<HTMLDivElement, DocumentContentProps>(({
  editor
}, ref) => {
  // Use our custom hooks for handling mentions and editor setup
  const {
    mentionQuery,
    mentionClientRect,
    selectedItemIndex,
    setSelectedItemIndex,
    selectedCategory,
    mentionItems,
    mentionLoading,
    mentionSelectorRef,
    handleCategorySelect,
    handleMentionSelect,
    setMentionQuery,
    setMentionRange,
    setMentionClientRect,
    setSelectedCategory,
    configureSuggestion
  } = useMentionHandler(editor);
  
  // Set up inline mention commands for shortcuts like /e, /t, etc.
  useInlineMentionCommands(
    editor, 
    setSelectedCategory, 
    setMentionQuery, 
    setMentionRange, 
    setMentionClientRect
  );

  // Initialize suggestion plugin only once on editor mount
  useEffect(() => {
    if (!editor) return;
    
    // Import Suggestion here to avoid issues with SSR
    const importSuggestion = async () => {
      try {
        const { default: Suggestion } = await import('@tiptap/suggestion');
        
        // Register the suggestion plugin with our configuration only once
        editor.registerPlugin(Suggestion(configureSuggestion()));
      } catch (error) {
        console.error("Error loading suggestion extension:", error);
      }
    };
    
    importSuggestion();
    
    // No cleanup needed - handled by editor destruction
  }, [editor, configureSuggestion]);

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

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-hidden">
        <div ref={ref} className="bg-white rounded-md border border-zinc-200 h-full overflow-y-auto flex flex-col print-document">
          <EditorContent editor={editor} className="flex-1 p-3 h-full prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none px-[25px] document-content" />
          
          {mentionQuery !== null && mentionClientRect && (
            <MentionSelector
              ref={mentionSelectorRef}
              items={mentionItems}
              command={handleMentionSelect}
              query={mentionQuery}
              clientRect={mentionClientRect}
              loading={mentionLoading}
              selectedIndex={selectedItemIndex}
              setSelectedIndex={setSelectedItemIndex}
              onCategorySelect={handleCategorySelect}
              category={selectedCategory}
            />
          )}
        </div>
      </div>
    </div>
  );
});

DocumentContent.displayName = 'DocumentContent';
