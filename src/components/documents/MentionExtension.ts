
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MentionView } from './MentionView';
import { SuggestionOptions } from '@tiptap/suggestion';
import Suggestion from '@tiptap/suggestion';
import { Extension } from '@tiptap/core';
import { RawCommands } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';

// Create a dedicated plugin key for mention suggestions
export const mentionSuggestionKey = new PluginKey('mentionSuggestion');

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
      setMention: (attrs) => ({ commands }) => {
        console.log('setMention command called with attrs:', attrs);
        return commands.insertContent({
          type: 'mention',
          attrs
        });
      }
    } as Partial<RawCommands>;
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
        command: ({ editor, range, props }) => {
          console.log('Mention suggestion command executing with props:', props);
          
          // Delete the slash command
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
    console.log('Adding ProseMirror plugins for mentions with char:', this.options.suggestion.char);
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
