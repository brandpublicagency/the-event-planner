
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { supabase } from '@/integrations/supabase/client';
import Tribute from 'tributejs';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast';
import { FileText, CheckSquare, Calendar, User } from 'lucide-react';

// Type for mention items
interface MentionResult {
  id: string;
  title: string;
  type: 'event' | 'task' | 'document' | 'user';
  url: string;
  icon?: string;
  color?: string;
  idLabel?: string;
}

// Create a debounced search function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Function to generate ID labels based on type
const generateIdLabel = (id: string, type: string): string => {
  switch (type) {
    case 'event':
      return `#${id.substring(0, 6)}`;
    case 'task':
      return `#${id.substring(0, 6)}`;
    case 'document':
      return `#${id.substring(0, 6)}`;
    case 'user':
      return `#${id.substring(0, 6)}`;
    default:
      return `#${id.substring(0, 6)}`;
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
            { type: 'document', label: 'Documents', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>', color: 'text-amber-500' },
            { type: 'task', label: 'Tasks', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-square"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>', color: 'text-red-500' },
            { type: 'event', label: 'Events', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>', color: 'text-green-500' },
            { type: 'user', label: 'Users', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', color: 'text-blue-500' }
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
                item.icon = group.icon;
                item.color = group.color;
                item.idLabel = generateIdLabel(item.id, item.type);
                result.push(item);
              });
            }
          });
          
          return result;
        };

        const tribute = new Tribute({
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
                    title: doc.title,
                    type: 'document' as const,
                    url: `/documents?id=${doc.id}`,
                  })) || []),
                  ...(tasks?.map(task => ({
                    id: task.id,
                    title: task.title,
                    type: 'task' as const,
                    url: `/tasks/${task.id}`,
                  })) || []),
                  ...(events?.map(event => ({
                    id: event.event_code,
                    title: event.name,
                    type: 'event' as const,
                    url: `/event-details/${event.event_code}`,
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
              enter: null,
              up: 38,
              down: 40
            },
            selectTemplate: (item) => {
              if (item.original.isHeader) {
                return ''; // Don't insert headers
              }
              
              return `<span 
                class="mention mention-${item.original.type}" 
                data-mention-id="${item.original.id}" 
                data-mention-type="${item.original.type}" 
                data-mention-url="${item.original.url}"
                data-mention-title="${item.original.title}"
                contenteditable="false">
                <span class="mention-icon">${item.original.icon}</span>
                <span class="mention-title">${item.original.title}</span>
                <span class="mention-id">${item.original.idLabel || ''}</span>
              </span>`;
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
                  <span class="mention-id">${item.original.idLabel || ''}</span>
                </div>
              </div>`;
            },
            noMatchTemplate: () => '<div class="tribute-item tribute-no-match">No matches found</div>',
            loadingTemplate: loadingTemplate,
          }],
          positionMenu: true,
          containerClass: 'tribute-container',
        });

        // Find the editable DOM element
        const editorDOM = editorView.dom;
        if (editorDOM) {
          // Attach tribute to the editor
          tribute.attach(editorDOM);
          
          // Add click handler for mentions
          editorDOM.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const mentionElement = target.closest('.mention');
            
            if (mentionElement) {
              e.preventDefault();
              
              const url = mentionElement.getAttribute('data-mention-url');
              const type = mentionElement.getAttribute('data-mention-type');
              const title = mentionElement.getAttribute('data-mention-title');
              
              if (url) {
                // Show a toast notification for user mentions
                if (type === 'user') {
                  toast({
                    title: "User Profile",
                    description: `Viewing profile for ${title}`,
                    variant: "info"
                  });
                } else if (type === 'document') {
                  toast({
                    title: "Document",
                    description: `Opening document: ${title}`,
                    variant: "info"
                  });
                } else if (type === 'task') {
                  toast({
                    title: "Task",
                    description: `Opening task: ${title}`,
                    variant: "info"
                  });
                } else if (type === 'event') {
                  toast({
                    title: "Event",
                    description: `Opening event: ${title}`,
                    variant: "info"
                  });
                }
                
                // Use window.location for navigation since we don't have access to React Router's navigate here
                window.location.href = url;
              }
            }
          });

          // Add tooltip behavior for mentions
          editorDOM.addEventListener('mouseover', (e) => {
            const target = e.target as HTMLElement;
            const mentionElement = target.closest('.mention');
            
            if (mentionElement) {
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
              
              // Remove tooltip on mouseout
              mentionElement.addEventListener('mouseout', () => {
                document.body.removeChild(tooltip);
              }, { once: true });
            }
          });
        }

        return {
          destroy: () => {
            if (editorDOM) {
              tribute.detach(editorDOM);
            }
          },
        };
      },
    });

    return [plugin];
  },
});
