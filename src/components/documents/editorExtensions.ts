import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import { common } from 'lowlight/common';
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
    addNodeView: () => ({
      onBeforeCreate({ node }) {
        const url = node.attrs?.href;
        if (url && !url.startsWith('/')) {
          return createLinkPreviewNodeView(node);
        }
        return null;
      },
    }),
  }),
  Highlight.configure({
    multicolor: true,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
];