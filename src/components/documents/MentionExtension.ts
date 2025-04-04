
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MentionView } from './MentionView';

export interface MentionOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mention: {
      /**
       * Add a mention at the current position
       */
      setMention: (options: { id: string; label: string; type: 'event' | 'task' | 'document' }) => ReturnType;
    };
  }
}

export const MentionNode = Node.create<MentionOptions>({
  name: 'mention',
  
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'mention',
      },
    };
  },
  
  group: 'inline',
  
  inline: true,
  
  selectable: false,
  
  atom: true,
  
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          
          return {
            'data-id': attributes.id,
          };
        },
      },
      
      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: attributes => {
          if (!attributes.label) {
            return {};
          }
          
          return {
            'data-label': attributes.label,
          };
        },
      },
      
      type: {
        default: 'document',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          if (!attributes.type) {
            return {};
          }
          
          return {
            'data-type': attributes.type,
          };
        },
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-mention]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-mention': '' }), 0];
  },
  
  addNodeView() {
    // Cast the MentionView to make TypeScript happy
    return ReactNodeViewRenderer(MentionView as any);
  },
  
  addCommands() {
    return {
      setMention: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
