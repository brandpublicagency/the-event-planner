import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { createLinkPreviewNodeView } from './LinkPreviewNodeView';

const lowlight = createLowlight(common);

export const getEditorExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    codeBlock: false,
  }),
  Underline,
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      class: 'text-primary underline',
    },
    protocols: ['http', 'https', 'mailto', 'tel'],
    validate: href => /^https?:\/\//.test(href),
  }),
  Highlight.configure({
    multicolor: true,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
];