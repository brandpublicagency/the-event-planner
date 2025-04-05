
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { supabase } from '@/integrations/supabase/client';
import Tribute from 'tributejs';
import { toast } from '@/components/ui/toast';

// Type for mention items
interface MentionResult {
  id: string;
  title: string;
  type: 'event' | 'task' | 'document' | 'user';
  url: string;
  icon?: string;
  color?: string;
}

// Create a debounced search function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Get icon SVG based on type
const getIconSvg = (type: string): string => {
  switch (type) {
    case 'document':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
    case 'task':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="3" height="9" x="4" y="15" rx="1"/><rect width="3" height="5" x="12" y="15" rx="1"/><rect width="3" height="14" x="20" y="10" rx="1"/><path d="M4 9l4-4 4 4 8-8"/></svg>';
    case 'event':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
    case 'user':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    default:
      return '';
  }
};

export const MentionExtension = Extension.create({
  name: 'mentions',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'mention',
      },
      suggestionClass: 'mention-suggestion',
    };
  },

  addProseMirrorPlugins() {
    const plugin = new Plugin({
      key: new PluginKey('mentions'),
      view: (editorView) => {
        let isSearching = false;
        let tribute: Tribute | null = null;

        const loadingTemplate = () => {
          return '<div class="tribute-item tribute-item-loading">' +
            '<div class="loading-spinner"></div>' +
            '<span>Searching...</span>' +
          '</div>';
        };

        // Group items by type
        const groupItems = (items: MentionResult[]) => {
          const grouped: {[key: string]: MentionResult[]} = {
            document: [],
            task: [],
            event: [],
            user: []
          };
          
          items.forEach(item => {
            if (grouped[item.type]) {
              grouped[item.type].push(item);
            }
          });
          
          // Return a flattened array with group headers
          const result: any[] = [];
          
          // Define display order and icons
          const groups = [
            { type: 'document', label: 'Documents' },
            { type: 'task', label: 'Tasks' },
            { type: 'event', label: 'Events' },
            { type: 'user', label: 'Users' }
          ];
          
          groups.forEach(group => {
            if (grouped[group.type].length > 0) {
              // Add header
              result.push({
                type: 'header',
                title: group.label,
                isHeader: true
              });
              
              // Add items with icons and colors
              grouped[group.type].forEach(item => {
                item.icon = getIconSvg(group.type);
                result.push(item);
              });
            }
          });
          
          return result;
        };

        const initTribute = () => {
          // Clean up any existing tribute instance
          if (tribute) {
            tribute.detach(editorView.dom);
          }

          tribute = new Tribute({
            collection: [{
              trigger: '/',
              values: debounce(async (text: string, callback: (items: any[]) => void) => {
                // Skip the / character in the search
                const searchQuery = text.substring(1);
                
                // Set searching state
                isSearching = true;
                
                if (searchQuery.length < 2) {
                  callback([]);
                  isSearching = false;
                  return;
                }

                try {
                  // Search for documents
                  const { data: documents } = await supabase
                    .from('documents')
                    .select('id, title')
                    .ilike('title', `%${searchQuery}%`)
                    .is('deleted_at', null)
                    .limit(5);

                  // Search for tasks
                  const { data: tasks } = await supabase
                    .from('tasks')
                    .select('id, title')
                    .ilike('title', `%${searchQuery}%`)
                    .is('deleted_at', null)
                    .limit(5);

                  // Search for events
                  const { data: events } = await supabase
                    .from('events')
                    .select('event_code, name')
                    .ilike('name', `%${searchQuery}%`)
                    .is('deleted_at', null)
                    .limit(5);

                  // Search for users
                  const { data: users } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .ilike('full_name', `%${searchQuery}%`)
                    .limit(5);

                  // Format results
                  const results: MentionResult[] = [
                    ...(documents?.map(doc => ({
                      id: doc.id,
                      title: doc.title || 'Untitled',
                      type: 'document' as const,
                      url: `/documents?selected=${doc.id}`,
                    })) || []),
                    ...(tasks?.map(task => ({
                      id: task.id,
                      title: task.title,
                      type: 'task' as const,
                      url: `/tasks?selected=${task.id}`,
                    })) || []),
                    ...(events?.map(event => ({
                      id: event.event_code,
                      title: event.name,
                      type: 'event' as const,
                      url: `/events/${event.event_code}`,
                    })) || []),
                    ...(users?.map(user => ({
                      id: user.id,
                      title: user.full_name,
                      type: 'user' as const,
                      url: `/profile/${user.id}`,
                    })) || []),
                  ];

                  // Group and organize the results
                  const groupedResults = groupItems(results);
                  callback(groupedResults);
                } catch (error) {
                  console.error('Error fetching mention suggestions:', error);
                  callback([]);
                } finally {
                  isSearching = false;
                }
              }, 300),
              lookup: 'title',
              fillAttr: 'title',
              menuShowMinLength: 2,
              requireLeadingSpace: false,
              allowSpaces: true,
              searchOpts: {
                pre: '<span class="highlighted">',
                post: '</span>',
                skip: false
              },
              keys: {
                tab: 9,
                enter: 13,
                up: 38,
                down: 40
              },
              selectTemplate: (item) => {
                if (item.original.isHeader) {
                  return ''; // Don't insert headers
                }
                
                // Content inside the editor - properly styled as a button
                return `<span 
                  contenteditable="false" 
                  class="mention mention-${item.original.type}" 
                  data-mention-id="${item.original.id}" 
                  data-mention-type="${item.original.type}" 
                  data-mention-url="${item.original.url}" 
                  data-mention-title="${item.original.title}"
                ><span class="mention-icon">${getIconSvg(item.original.type)}</span><span class="mention-title">${item.original.title}</span></span>`;
              },
              menuItemTemplate: (item) => {
                if (item.original.isHeader) {
                  return `<div class="tribute-item tribute-header">
                    <span class="mention-header-title">${item.original.title}</span>
                  </div>`;
                }
                
                return `<div class="tribute-item tribute-item-${item.original.type}">
                  <span class="mention-icon">${item.original.icon}</span>
                  <div class="mention-info">
                    <span class="mention-title">${item.original.title}</span>
                  </div>
                </div>`;
              },
              noMatchTemplate: () => '<div class="tribute-item tribute-no-match">No matches found</div>',
              loadingTemplate: loadingTemplate,
            }],
            positionMenu: true,
            containerClass: 'tribute-container',
          });

          return tribute;
        };

        // Initialize tribute
        tribute = initTribute();

        // Support for Tab key to insert mention
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            // Check if we're in a position to insert a mention
            const { state } = editorView;
            const { $head } = state.selection;
            
            // Only trigger if not already in a mention
            if (!$head.nodeBefore || $head.nodeBefore.text?.endsWith('/')) {
              return;
            }
            
            // Insert the slash character
            editorView.dispatch(state.tr.insertText('/'));
            e.preventDefault();
          }
        };

        // Find the editable DOM element
        const editorDOM = editorView.dom;
        
        if (editorDOM) {
          // Attach tribute to the editor
          tribute.attach(editorDOM);
          
          // Add Tab key handler
          editorDOM.addEventListener('keydown', handleKeyDown);
          
          // Add click handler for mentions
          editorDOM.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const mentionElement = target.closest('.mention');
            
            if (mentionElement) {
              e.preventDefault();
              e.stopPropagation(); // Stop event propagation
              
              const url = mentionElement.getAttribute('data-mention-url');
              const type = mentionElement.getAttribute('data-mention-type');
              const title = mentionElement.getAttribute('data-mention-title');
              
              if (url) {
                // Show a toast notification before navigating
                toast.info(`Navigating to ${title}`);
                
                // Navigate to the URL
                window.location.href = url;
              }
            }
          });

          // Add tooltip behavior for mentions
          let currentTooltip: HTMLElement | null = null;
          
          editorDOM.addEventListener('mouseover', (e) => {
            const target = e.target as HTMLElement;
            const mentionElement = target.closest('.mention');
            
            if (mentionElement && !currentTooltip) {
              const type = mentionElement.getAttribute('data-mention-type');
              const title = mentionElement.getAttribute('data-mention-title');
              
              let tooltipText = '';
              switch (type) {
                case 'document':
                  tooltipText = `View document: ${title}`;
                  break;
                case 'task':
                  tooltipText = `View task: ${title}`;
                  break;
                case 'event':
                  tooltipText = `View event: ${title}`;
                  break;
                case 'user':
                  tooltipText = `View profile: ${title}`;
                  break;
              }
              
              // Add tooltip
              const tooltip = document.createElement('div');
              tooltip.className = 'mention-tooltip';
              tooltip.textContent = tooltipText;
              
              // Position tooltip
              const rect = mentionElement.getBoundingClientRect();
              tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
              tooltip.style.left = `${rect.left + window.scrollX}px`;
              
              document.body.appendChild(tooltip);
              currentTooltip = tooltip;
              
              // Remove tooltip on mouseout
              const removeTooltip = () => {
                if (currentTooltip && document.body.contains(currentTooltip)) {
                  document.body.removeChild(currentTooltip);
                }
                currentTooltip = null;
                mentionElement.removeEventListener('mouseout', removeTooltip);
              };
              
              mentionElement.addEventListener('mouseout', removeTooltip);
            }
          });
        }

        return {
          destroy: () => {
            if (editorDOM && tribute) {
              tribute.detach(editorDOM);
              editorDOM.removeEventListener('keydown', handleKeyDown);
            }
          },
        };
      },
    });

    return [plugin];
  },
});
