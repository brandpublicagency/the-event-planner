
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { supabase } from '@/integrations/supabase/client';
import Tribute from 'tributejs';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast';

// Type for mention items
interface MentionResult {
  id: string;
  title: string;
  type: 'event' | 'task' | 'document' | 'user';
  url: string;
  icon?: string;
}

// Create a debounced search function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
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
            { type: 'document', label: 'Documents', icon: '📄' },
            { type: 'task', label: 'Tasks', icon: '✓' },
            { type: 'event', label: 'Events', icon: '🗓️' },
            { type: 'user', label: 'Users', icon: '👤' }
          ];
          
          groups.forEach(group => {
            if (grouped[group.type].length > 0) {
              // Add header
              result.push({
                type: 'header',
                title: group.label,
                isHeader: true
              });
              
              // Add items with icons
              grouped[group.type].forEach(item => {
                item.icon = group.icon;
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

                // Search for events - note the correct column names
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
                data-mention-title="${item.original.title}">
                ${item.original.type}:${item.original.title}
              </span>`;
            },
            menuItemTemplate: (item) => {
              if (item.original.isHeader) {
                return `<div class="tribute-item tribute-header">
                  <span class="mention-header-title">${item.original.title}</span>
                </div>`;
              }
              
              return `<div class="tribute-item tribute-item-${item.original.type}">
                <span class="mention-icon">${item.original.icon || ''}</span>
                <span class="mention-type">${item.original.type}</span>
                <span class="mention-title">${item.original.title}</span>
              </div>`;
            },
            noMatchTemplate: () => '<div class="tribute-item tribute-no-match">No matches found</div>',
            loadingTemplate: loadingTemplate,
          }],
          positionMenu: true,
          containerClass: 'tribute-container tribute-wrapper',
        });

        // Find the editable DOM element
        const editorDOM = editorView.dom;
        if (editorDOM) {
          // Attach tribute to the editor
          tribute.attach(editorDOM);
          
          // Add click handler for mentions
          editorDOM.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('mention')) {
              e.preventDefault();
              
              const url = target.getAttribute('data-mention-url');
              const type = target.getAttribute('data-mention-type');
              const title = target.getAttribute('data-mention-title');
              
              if (url) {
                // Show a toast notification for user mentions
                if (type === 'user') {
                  toast({
                    title: "User Profile",
                    description: `Viewing profile for ${title}`,
                    variant: "info"
                  });
                }
                
                // Use window.location for navigation since we don't have access to React Router's navigate here
                window.location.href = url;
              }
            }
          });

          // Add tooltip behavior for mentions
          if ('title' in HTMLElement.prototype) {
            editorDOM.addEventListener('mouseover', (e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains('mention')) {
                const type = target.getAttribute('data-mention-type');
                const title = target.getAttribute('data-mention-title');
                
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
                
                target.title = tooltipText;
              }
            });
          }
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
