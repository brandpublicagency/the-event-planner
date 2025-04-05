
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import Tribute from 'tributejs';
import { supabase } from '@/integrations/supabase/client';

// Type for mention items
interface MentionResult {
  id: string;
  title: string;
  type: 'event' | 'task' | 'document' | 'user';
  url: string;
}

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
        const tribute = new Tribute({
          trigger: '/',
          collection: [{
            trigger: '/',
            values: async (text: string, callback: (items: MentionResult[]) => void) => {
              // Skip the / character in the search
              const searchQuery = text.substring(1);
              
              if (searchQuery.length < 2) {
                callback([]);
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

                callback(results);
              } catch (error) {
                console.error('Error fetching mention suggestions:', error);
                callback([]);
              }
            },
            lookup: 'title',
            fillAttr: 'title',
            menuItemLimit: 10,
            menuShowMinLength: 2,
            selectTemplate: (item) => {
              return `<span 
                class="mention mention-${item.original.type}" 
                data-mention-id="${item.original.id}" 
                data-mention-type="${item.original.type}" 
                data-mention-url="${item.original.url}">
                ${item.original.type}:${item.original.title}
              </span>`;
            },
            menuItemTemplate: (item) => {
              return `<div class="tribute-item">
                <span class="mention-type">${item.original.type}</span>
                <span class="mention-title">${item.original.title}</span>
              </div>`;
            },
            noMatchTemplate: () => '<div class="tribute-item">No matches found</div>',
          }]
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
              const url = target.getAttribute('data-mention-url');
              if (url) {
                window.location.href = url;
              }
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
