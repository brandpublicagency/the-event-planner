
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MentionView } from './MentionView';
import { SuggestionOptions } from '@tiptap/suggestion';
import { Extension } from '@tiptap/core';

export interface MentionOptions {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: { options: MentionOptions; node: any }) => string;
  suggestion: Omit<SuggestionOptions, 'editor'>;
}

// Create the setMention command extension
export const MentionCommands = Extension.create({
  name: 'mentionCommands',
  
  addCommands() {
    return {
      setMention: (attrs) => ({ chain }) => {
        return chain()
          .insertContent({
            type: 'mention',
            attrs
          })
          .run();
      }
    };
  }
});

export const MentionNode = Node.create<MentionOptions>({
  name: 'mention',
  
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'mention',
      },
      renderLabel({ options, node }) {
        return `${node.attrs.label ?? node.attrs.id}`;
      },
      suggestion: {
        char: '/',
        command: () => {},
        items: () => [],
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
      },
      label: {
        default: null,
      },
      type: {
        default: null,
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-mention]',
        getAttrs: (element) => {
          if (typeof element === 'string') {
            return false;
          }
          
          const id = element.getAttribute('data-id');
          const type = element.getAttribute('data-type');
          
          if (!id || !type) {
            return false;
          }
          
          return {
            id,
            type,
            label: element.textContent,
          };
        },
      },
    ];
  },
  
  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-mention': '' },
        { 'data-id': node.attrs.id },
        { 'data-type': node.attrs.type },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(MentionView);
  },
});
