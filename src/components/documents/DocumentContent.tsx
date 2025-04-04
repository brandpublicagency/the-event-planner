
import { Editor, EditorContent, Range } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { forwardRef, useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MentionSelector } from './MentionSelector';
import { useMentionItems } from '@/hooks/useMentionItems';
import { SuggestionOptions } from '@tiptap/suggestion';

interface DocumentContentProps {
  editor: Editor | null;
}

export const DocumentContent = forwardRef<HTMLDivElement, DocumentContentProps>(({
  editor
}, ref) => {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionRange, setMentionRange] = useState<Range | null>(null);
  const [mentionClientRect, setMentionClientRect] = useState<DOMRect | null>(null);
  const { items: mentionItems, loading: mentionLoading } = useMentionItems(mentionQuery);

  // Suggestion handler for mentions
  const mentionSuggestionHandler = useCallback((props: any) => {
    const { editor, range, query, command } = props;
    
    // Update the mention state
    setMentionQuery(query);
    setMentionRange(range);
    
    // Get client rect of the current position
    if (editor.view.domAtPos(range.from)) {
      const domAtPos = editor.view.domAtPos(range.from);
      if (domAtPos && domAtPos.node) {
        const element = domAtPos.node.parentElement;
        if (element) {
          const rect = element.getBoundingClientRect();
          setMentionClientRect(rect);
        }
      }
    }
    
    // Handle selection of a mention
    const onSelectMention = (item: { id: string, label: string, type: string }) => {
      command({
        id: item.id,
        label: item.label,
        type: item.type,
      });
      
      // Reset state after selection
      setMentionQuery(null);
      setMentionRange(null);
      setMentionClientRect(null);
    };
    
    return {
      onExit: () => {
        setMentionQuery(null);
        setMentionRange(null);
        setMentionClientRect(null);
      },
      reactRenderer: () => (
        <MentionSelector
          items={mentionItems}
          command={onSelectMention}
          query={query}
          clientRect={mentionClientRect}
          loading={mentionLoading}
        />
      )
    };
  }, [mentionItems, mentionLoading]);

  // Configure the mention suggestion extension
  useEffect(() => {
    if (!editor) return;
    
    // Import Suggestion here to avoid issues with SSR
    const importSuggestion = async () => {
      try {
        const { default: Suggestion } = await import('@tiptap/suggestion');
        
        const options = {
          char: '@',
          items: ({ query }: { query: string }) => {
            return mentionItems;
          },
          render: mentionSuggestionHandler,
          command: ({ editor, range, props }: any) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setMention({
                id: props.id,
                label: props.label,
                type: props.type
              })
              .run();
          }
        };
        
        // Create and register the suggestion
        if (editor && !editor.isDestroyed) {
          // Direct use of Suggestion without configure
          const suggestionPlugin = Suggestion(options);
          editor.registerPlugin(suggestionPlugin);
          
          return suggestionPlugin;
        }
      } catch (error) {
        console.error("Error loading suggestion extension:", error);
      }
      
      return null;
    };

    // Execute the import and setup
    const extensionPromise = importSuggestion();
    
    return () => {
      // Cleanup on unmount
      if (extensionPromise) {
        extensionPromise.then(plugin => {
          if (editor && !editor.isDestroyed && plugin) {
            editor.unregisterPlugin(plugin);
          }
        });
      }
    };
  }, [editor, mentionItems, mentionSuggestionHandler]);

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
