import { Extension } from '@tiptap/core';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: string;
  category: string;
  command: (props: { editor: any; range: any }) => void;
}

export const slashCommandItems: SlashCommandItem[] = [
  {
    title: 'Text',
    description: 'Plain text block',
    icon: 'Type',
    category: 'Basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Large heading',
    icon: 'Heading1',
    category: 'Basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium heading',
    icon: 'Heading2',
    category: 'Basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small heading',
    icon: 'Heading3',
    category: 'Basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Unordered list',
    icon: 'List',
    category: 'Basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Ordered list',
    icon: 'ListOrdered',
    category: 'Basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Task List',
    description: 'Checklist with checkboxes',
    icon: 'CheckSquare',
    category: 'Basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Quote',
    description: 'Block quotation',
    icon: 'Quote',
    category: 'Basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: 'Divider',
    description: 'Horizontal separator',
    icon: 'Minus',
    category: 'Basic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: 'Image',
    description: 'Upload or insert image',
    icon: 'ImageIcon',
    category: 'Media',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // Dispatch custom event to trigger file picker
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('editor-image-upload'));
      }, 100);
    },
  },
  {
    title: 'Code Block',
    description: 'Syntax-highlighted code',
    icon: 'Code',
    category: 'Media',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: 'Link Preview',
    description: 'Embed a link with preview',
    icon: 'ExternalLink',
    category: 'Media',
    command: ({ editor, range }) => {
      const url = window.prompt('Enter URL for preview');
      if (url) {
        editor.chain().focus().deleteRange(range).setLinkPreview({ url }).run();
      }
    },
  },
  {
    title: 'Table',
    description: 'Insert a 3×3 table',
    icon: 'Table',
    category: 'Advanced',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    },
  },
  {
    title: 'Highlight',
    description: 'Highlight text',
    icon: 'Highlighter',
    category: 'Advanced',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHighlight().run();
    },
  },
];

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: any; range: any; props: any }) => {
          props.command({ editor, range });
        },
      } as Partial<SuggestionOptions>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
