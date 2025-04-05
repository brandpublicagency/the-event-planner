
import { Editor, EditorContent, Range } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { forwardRef, useEffect, useState, useCallback, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MentionSelector } from './MentionSelector';
import { useMentionItems, MentionCategory } from '@/hooks/useMentionItems';
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
  const [selectedCategory, setSelectedCategory] = useState<MentionCategory>(null);
  const { items: mentionItems, loading: mentionLoading } = useMentionItems(mentionQuery, selectedCategory);
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
          char: '/',
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
                setSelectedCategory(null);
                
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
                  event.preventDefault(); // Prevent cursor movement
                  setSelectedItemIndex((prev) => 
                    prev > 0 ? prev - 1 : mentionItems.length - 1
                  );
                  return true;
                }
                
                if (event.key === 'ArrowDown') {
                  event.preventDefault(); // Prevent cursor movement
                  setSelectedItemIndex((prev) => 
                    prev < mentionItems.length - 1 ? prev + 1 : 0
                  );
                  return true;
                }
                
                if (event.key === 'Enter' && mentionItems.length && selectedItemIndex >= 0) {
                  event.preventDefault(); // Prevent newline insertion
                  const item = mentionItems[selectedItemIndex];
                  if (item) {
                    // Check if this is a category selection
                    if (item.id.startsWith('category-') && selectedCategory === null) {
                      setSelectedCategory(item.type as MentionCategory);
                      setSelectedItemIndex(0);
                      setMentionQuery(''); // Clear the query when selecting a category
                      return true;
                    } else {
                      // Handle item selection
                      handleMentionSelect(item);
                      return true;
                    }
                  }
                }
                
                if (event.key === 'Escape') {
                  // If category is selected, go back to categories
                  if (selectedCategory !== null) {
                    setSelectedCategory(null);
                    setSelectedItemIndex(0);
                    return true;
                  } else {
                    // Clear mention state completely
                    closeAndResetMention();
                    return true;
                  }
                }
                
                if (event.key === 'Backspace' && selectedCategory !== null && !mentionQuery) {
                  // If query is empty and backspace is pressed, go back to categories
                  setSelectedCategory(null);
                  setSelectedItemIndex(0);
                  return false; // Let the editor handle the backspace
                }
                
                return false;
              },
              onExit: () => {
                // Adding a delay to prevent too quick disappearance
                setTimeout(() => {
                  closeAndResetMention();
                }, 250); // Increased delay to allow for interaction
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
  }, [editor, mentionItems, selectedItemIndex, selectedCategory]);

  // Handle category selection
  const handleCategorySelect = useCallback((category: MentionCategory) => {
    setSelectedCategory(category);
    setSelectedItemIndex(0);
    setMentionQuery('');
  }, []);

  // Close and reset mention state
  const closeAndResetMention = useCallback(() => {
    if (mentionQuery !== null) {
      setMentionQuery(null);
      setMentionRange(null);
      setMentionClientRect(null);
      setSelectedItemIndex(0);
      setSelectedCategory(null);
    }
  }, [mentionQuery]);

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
      
      // Clear mention state
      closeAndResetMention();
    }
  }, [editor, mentionRange, closeAndResetMention]);

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
