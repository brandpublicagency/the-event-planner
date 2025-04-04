
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LinkPreviewView } from './LinkPreviewView';

export const LinkPreviewNode = Node.create({
  name: 'linkPreview',
  
  group: 'block',
  
  atom: true, // This ensures it's treated as an atomic node
  
  addAttributes() {
    return {
      url: {
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
    return ['div', mergeAttributes({ 'data-type': 'link-preview' }, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkPreviewView);
  },
});
