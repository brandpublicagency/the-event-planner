
import { Editor, EditorContent, Range, Extension } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { forwardRef, useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MentionSelector } from './MentionSelector';
import { useMentionItems } from '@/hooks/useMentionItems';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';

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
    
    const mentionExtension = Suggestion({
      char: '@',
      items: ({ query }) => {
        return mentionItems;
      },
      render: mentionSuggestionHandler,
      command: ({ editor, range, props }) => {
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
    });
    
    // Add the extension to the editor
    editor.registerPlugin(mentionExtension);
    
    return () => {
      // Cleanup on unmount
      editor.unregisterPlugin(mentionExtension);
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
