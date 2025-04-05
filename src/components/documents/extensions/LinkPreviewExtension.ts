
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LinkPreviewComponent } from '../LinkPreviewComponent';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkPreview: {
      /**
       * Add a link preview
       */
      setLinkPreview: (options: { url: string }) => ReturnType,
    }
  }
}

export const LinkPreviewExtension = Node.create({
  name: 'linkPreview',
  
  group: 'block',
  
  content: 'inline*',
  
  atom: true,
  
  draggable: true,
  
  isolating: true,

  addAttributes() {
    return {
      url: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-link-preview]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-link-preview': '' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkPreviewComponent)
  },

  addCommands() {
    return {
      setLinkPreview: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
