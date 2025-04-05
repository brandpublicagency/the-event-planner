
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MentionView } from '../MentionView';
import { SuggestionOptions } from '@tiptap/suggestion';
import { mentionSuggestionKey } from './mentionKeys';

export interface MentionOptions {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: { options: MentionOptions; node: any }) => string;
  suggestion: Omit<SuggestionOptions, 'editor'>;
}

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
        command: ({ editor, range, props }) => {
          console.log('Mention suggestion command executing with props:', props);
          
          // Delete the command text
          editor.chain().focus().deleteRange(range).run();
          
          // Insert the mention
          editor.commands.insertContent({
            type: 'mention',
            attrs: props
          });
          
          // Ensure cursor position is after the mention
          editor.commands.focus();
        },
        items: ({ query }) => {
          console.log('Default items function called with query:', query);
          return [];
        },
        pluginKey: mentionSuggestionKey,
        allowSpaces: false,
        startOfLine: false,
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
  
  addProseMirrorPlugins() {
    // We'll use our custom inline suggestions instead
    return [];
  },
});
