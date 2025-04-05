
import { Editor, EditorContent, Range } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { forwardRef, useEffect, useState, useCallback, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MentionSelector } from './MentionSelector';
import { useMentionItems } from '@/hooks/useMentionItems';
import { SuggestionOptions } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';

interface DocumentContentProps {
  editor: Editor | null;
}

// Create a plugin key for the suggestion
const suggestionPluginKey = new PluginKey('mention-suggestion');

export const DocumentContent = forwardRef<HTMLDivElement, DocumentContentProps>(({
  editor
}, ref) => {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionRange, setMentionRange] = useState<Range | null>(null);
  const [mentionClientRect, setMentionClientRect] = useState<DOMRect | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { items: mentionItems, loading: mentionLoading } = useMentionItems(mentionQuery);
  const mentionSelectorRef = useRef<HTMLDivElement>(null);
  
  // Configure the mention suggestion extension
  useEffect(() => {
    if (!editor) return;
    
    // Import Suggestion here to avoid issues with SSR
    const importSuggestion = async () => {
      try {
        const { default: Suggestion } = await import('@tiptap/suggestion');
        
        // Define complete options object with all required properties
        const options: SuggestionOptions = {
          editor: editor,
          pluginKey: suggestionPluginKey,
          char: '@',
          items: ({ query }) => {
            return mentionItems;
          },
          render: () => {
            return {
              onStart: (props) => {
                const { editor, range, query } = props;
                
                // Update the mention state
                setMentionQuery(query);
                setMentionRange(range);
                setSelectedItemIndex(0);
                
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
              },
              onUpdate: (props) => {
                const { editor, range, query } = props;
                
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
              },
              onKeyDown: (props) => {
                const { event } = props;
                
                // Handle keyboard navigation
                if (event.key === 'ArrowUp') {
                  setSelectedItemIndex((prev) => 
                    prev > 0 ? prev - 1 : mentionItems.length - 1
                  );
                  return true;
                }
                
                if (event.key === 'ArrowDown') {
                  setSelectedItemIndex((prev) => 
                    prev < mentionItems.length - 1 ? prev + 1 : 0
                  );
                  return true;
                }
                
                if (event.key === 'Enter' && mentionItems.length && selectedItemIndex >= 0) {
                  const item = mentionItems[selectedItemIndex];
                  if (item) {
                    props.command(item);
                  }
                  return true;
                }
                
                if (event.key === 'Escape') {
                  props.exit();
                  return true;
                }
                
                return false;
              },
              onExit: () => {
                // Clean up when exiting
                setMentionQuery(null);
                setMentionRange(null);
                setMentionClientRect(null);
                setSelectedItemIndex(0);
              }
            };
          },
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
        };
        
        // Register the suggestion plugin
        editor.registerPlugin(Suggestion(options));
        
        return () => {
          // Clean up
          if (editor && !editor.isDestroyed) {
            editor.unregisterPlugin(suggestionPluginKey);
          }
        };
      } catch (error) {
        console.error("Error loading suggestion extension:", error);
      }
    };
    
    const cleanup = importSuggestion();
    
    return () => {
      // Handle cleanup when the component unmounts
      if (cleanup) {
        Promise.resolve(cleanup).then(cleanupFn => {
          if (cleanupFn) cleanupFn();
        });
      }
    };
  }, [editor, mentionItems, selectedItemIndex]);

  // Handle mention selection
  const handleMentionSelect = useCallback((item: any) => {
    if (editor && mentionRange) {
      editor
        .chain()
        .focus()
        .deleteRange(mentionRange)
        .setMention({
          id: item.id,
          label: item.label,
          type: item.type,
        })
        .run();
      
      setMentionQuery(null);
      setMentionRange(null);
      setMentionClientRect(null);
    }
  }, [editor, mentionRange]);

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
            />
          )}
        </div>
      </div>
    </div>
  );
});

DocumentContent.displayName = 'DocumentContent';
