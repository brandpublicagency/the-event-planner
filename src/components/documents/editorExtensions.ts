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

// Create a custom Link extension that extends the base Link extension
const CustomLink = Link.extend({
  addProseMirrorPlugins() {
    const plugins = this.parent?.() || [];

    // Add a paste handler through the editor's ProseMirror plugin
    return [
      ...plugins,
      {
        props: {
          handlePaste: (view, event) => {
            const url = event.clipboardData?.getData('text/plain');
            if (url && /^https?:\/\//.test(url)) {
              // Set the link
              this.editor?.commands.setLink({ href: url });
              // Create the link preview
              this.editor?.commands.createLinkPreview({ href: url });
              return true;
            }
            return false;
          },
        },
      },
    ];
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
  CustomLink.configure({
    openOnClick: true,
    HTMLAttributes: {
      class: 'text-primary underline',
    },
    protocols: ['http', 'https', 'mailto', 'tel'],
    validate: href => /^https?:\/\//.test(href),
  }),
  LinkPreviewNode,
  Highlight.configure({
    multicolor: true,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
];