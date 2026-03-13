
import { ReactRenderer } from '@tiptap/react';
import { supabase } from '@/integrations/supabase/client';
import MentionList from '../../MentionList';
import tippy from 'tippy.js';

export const MentionSuggestionConfig = {
  char: '@',
  startOfLine: false,
  allowSpaces: true,
  
  items: async ({ query }) => {
    const normalizedQuery = query.trim();
    
    try {
      // Search for documents
      const { data: documents } = await supabase
        .from('documents')
        .select('id, title')
        .ilike('title', `%${normalizedQuery}%`)
        .is('deleted_at', null)
        .limit(5);

      // Search for tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title')
        .ilike('title', `%${normalizedQuery}%`)
        .limit(5);

      // Search for events
      const { data: events } = await supabase
        .from('events')
        .select('event_code, name')
        .ilike('name', `%${normalizedQuery}%`)
        .is('deleted_at', null)
        .limit(5);

      // Search for users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('full_name', `%${normalizedQuery}%`)
        .limit(5);

      // Format results
      const result = [];
      
      // Add grouped headers and items
      if (documents?.length) {
        result.push({ id: 'header-document', isHeader: true, title: 'Documents', type: 'header' });
        result.push(...documents.map(doc => ({
          id: doc.id,
          title: doc.title || 'Untitled',
          type: 'document',
          url: `/documents?selected=${doc.id}`,
        })));
      }
      
      if (tasks?.length) {
        result.push({ id: 'header-task', isHeader: true, title: 'Tasks', type: 'header' });
        result.push(...tasks.map(task => ({
          id: task.id,
          title: task.title,
          type: 'task',
          url: `/tasks?selected=${task.id}`,
        })));
      }
      
      if (events?.length) {
        result.push({ id: 'header-event', isHeader: true, title: 'Events', type: 'header' });
        result.push(...events.map(event => ({
          id: event.event_code,
          title: event.name,
          type: 'event',
          url: `/events/${event.event_code}`,
        })));
      }
      
      if (users?.length) {
        result.push({ id: 'header-user', isHeader: true, title: 'Users', type: 'header' });
        result.push(...users.map(user => ({
          id: user.id,
          title: user.full_name,
          type: 'user',
          url: `/profile/${user.id}`,
        })));
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching mention suggestions:', error);
      return [];
    }
  },
  
  render: () => {
    let component;
    let popup;
    
    return {
      onStart: props => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });
        
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          animation: 'scale',
          theme: 'mention',
          maxWidth: '400px',
        })[0];
      },
      onUpdate: props => {
        component.updateProps(props);
        
        popup.setProps({
          getReferenceClientRect: props.clientRect,
        });
      },
      onKeyDown: props => {
        // Let the MentionList component handle the keyboard navigation
        if (['ArrowUp', 'ArrowDown', 'Enter', 'Tab'].includes(props.event.key)) {
          props.event.preventDefault();
          
          // Enter or Tab should apply the mention
          if (props.event.key === 'Enter' || props.event.key === 'Tab') {
            const item = component.ref?.getSelectedItem();
            if (item) {
              component.ref?.selectItem(item);
              return true;
            }
          }
          return true;
        }
        
        if (props.event.key === 'Escape') {
          popup.hide();
          return true;
        }
        
        return false;
      },
      onExit: () => {
        popup.destroy();
        component.destroy();
      },
    };
  },
  
  // Modified command for mentions to properly handle inline editing
  command: ({ editor, range, props }) => {
    // Skip if the suggestion is a header
    if (props.isHeader) {
      return false;
    }
    
    const nodeAttrs = {
      id: props.id,
      label: props.title,
      type: props.type,
      url: props.url,
    };
    
    // Delete the suggestion text (including the '/' character)
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .run();
    
    // Insert the mention node
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'mention',
        attrs: nodeAttrs,
      })
      .run();
      
    // Critical fix: Position cursor after the mention
    const { tr } = editor.view.state;
    const position = tr.selection.from;
    
    editor.view.dispatch(
      editor.view.state.tr.setSelection(
        editor.view.state.selection.constructor.near(
          editor.view.state.doc.resolve(position)
        )
      )
    );
    
    return true;
  },
};
