import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Node } from '@tiptap/core';
import type { NodeViewRenderer } from '@tiptap/core';
import { createLinkPreviewNodeView } from './LinkPreviewNodeView';

const lowlight = createLowlight(common);

// Custom node for link previews
const LinkPreviewNode = Node.create({
  name: 'linkPreview',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      href: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="link-preview"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'link-preview' }];
  },
  addNodeView() {
    return createLinkPreviewNodeView as unknown as NodeViewRenderer;
  },
});

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
    modifySelection: (url) => {
      // Convert link to preview when pasted
      return {
        href: url,
        'data-type': 'link-preview',
      };
    },
  }),
  LinkPreviewNode,
  Highlight.configure({
    multicolor: true,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
];