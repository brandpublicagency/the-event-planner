import { createRoot } from 'react-dom/client';
import { LinkPreview } from './LinkPreview';
import type { NodeViewRenderer } from '@tiptap/core';

interface NodeAttributes {
  href?: string;
}

export const createLinkPreviewNodeView: NodeViewRenderer = (props) => {
  const container = document.createElement('div');
  const preview = document.createElement('div');
  const attrs = props.node.attrs as NodeAttributes;
  const url = attrs?.href;
  
  if (!url) return { dom: container };
  
  preview.setAttribute('data-url', url);
  
  const root = createRoot(preview);
  root.render(<LinkPreview url={url} />);
  
  container.appendChild(preview);
  
  return {
    dom: container,
    destroy: () => {
      root.unmount();
    },
  };
};