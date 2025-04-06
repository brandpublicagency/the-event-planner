
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { LinkPreviewExtension } from './extensions/LinkPreviewExtension';
import { LinkPasteHandler } from './extensions/LinkPasteHandler';
import { MentionExtension } from './extensions/MentionExtension';
import { MentionNode } from './extensions/MentionNode';
import './mention.css';

const lowlight = createLowlight(common);

// Export all extensions
export const getEditorExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3]
    },
    codeBlock: false, // Disable the default code block to avoid conflicts
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
  Highlight.configure({
    multicolor: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  LinkPreviewExtension,
  LinkPasteHandler,
  MentionNode,
  MentionExtension,
];

// Helper function to check if button is active
export const isHeadingActive = (editor: any, level: number) => {
  return editor.isActive('heading', { level });
};

export const isMarkActive = (editor: any, type: string) => {
  return editor.isActive(type);
};
