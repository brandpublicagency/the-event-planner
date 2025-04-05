import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MentionView } from './MentionView';
import { SuggestionOptions } from '@tiptap/suggestion';
import Suggestion from '@tiptap/suggestion';
import { Extension } from '@tiptap/core';
import { RawCommands } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';

// Create dedicated plugin keys for different mention types
export const mentionSuggestionKey = new PluginKey('mentionSuggestion');
export const taskMentionKey = new PluginKey('taskMention');
export const eventMentionKey = new PluginKey('eventMention');
export const userMentionKey = new PluginKey('userMention');
export const documentMentionKey = new PluginKey('documentMention');

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

// Create a Tab key handler extension to improve tab navigation for mentions
export const TabKeyHandler = Extension.create({
  name: 'tabKeyHandler',
  
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // Instead of capturing the Tab key globally, we'll handle it in our InlineMentionSuggestions component
        // Let the default Tab behavior happen normally when not in an active mention suggestion
        return false;
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

// Improved extension for handling slash commands - will work with our inline suggestions
export const DirectMentionExtensions = Extension.create({
  name: 'directMentions',
  
  addProseMirrorPlugins() {
    // Here we're intentionally not adding Suggestion plugins since
    // we'll handle the suggestions with our custom InlineMentionSuggestions component
    return [];
  }
});
