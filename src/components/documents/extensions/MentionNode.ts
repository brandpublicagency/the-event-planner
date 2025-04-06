
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MentionComponent from '../MentionComponent';

export interface MentionOptions {
  HTMLAttributes: Record<string, any>;
}

export const MentionNode = Node.create<MentionOptions>({
  name: 'mention',
  
  group: 'inline',
  
  inline: true,
  
  selectable: false,
  
  atom: true,
  
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

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
      },
      url: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-mention]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { id, label, type, url } = node.attrs;
    
    let iconHtml = '';
    switch (type) {
      case 'document':
        iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
        break;
      case 'task':
        iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="3" height="9" x="4" y="15" rx="1"/><rect width="3" height="5" x="12" y="15" rx="1"/><rect width="3" height="14" x="20" y="10" rx="1"/><path d="M4 9l4-4 4 4 8-8"/></svg>';
        break;
      case 'event':
        iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
        break;
      case 'user':
        iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
        break;
    }
    
    return [
      'span',
      mergeAttributes(
        { 'data-mention': '' },
        { class: `mention mention-${type}` },
        { 'data-id': id },
        { 'data-type': type },
        { 'data-url': url },
        HTMLAttributes,
      ),
      [
        'span',
        { class: 'mention-icon' },
        iconHtml
      ],
      [
        'span',
        { class: 'mention-title' },
        label
      ]
    ];
  },

  // Use React component for mentions when available
  addNodeView() {
    return ReactNodeViewRenderer(MentionComponent);
  },
});
