
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import { LinkPreviewExtension } from './extensions/LinkPreviewExtension';
import { LinkPasteHandler } from './extensions/LinkPasteHandler';
import { MentionExtension } from './extensions/mention';
import { MentionNode } from './extensions/MentionNode';
import { SlashCommandExtension } from './SlashCommandExtension';
import { slashCommandSuggestion } from './slashCommandSuggestion';
import './styles/mention/index.css';

const lowlight = createLowlight(common);

export const getEditorExtensions = () => [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    codeBlock: false,
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-primary underline decoration-primary cursor-pointer',
    },
    autolink: true,
    validate: href => /^https?:\/\//.test(href),
  }),
  Highlight.configure({ multicolor: false }),
  CodeBlockLowlight.configure({ lowlight }),
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  Image.configure({
    HTMLAttributes: {
      class: 'document-image',
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Placeholder.configure({
    placeholder: "Type '/' for commands...",
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  TextStyle,
  Color,
  Typography,
  LinkPreviewExtension,
  LinkPasteHandler,
  MentionNode,
  MentionExtension,
  SlashCommandExtension.configure({
    suggestion: slashCommandSuggestion,
  }),
];

export const isHeadingActive = (editor: any, level: number) => {
  return editor.isActive('heading', { level });
};

export const isMarkActive = (editor: any, type: string) => {
  return editor.isActive(type);
};
