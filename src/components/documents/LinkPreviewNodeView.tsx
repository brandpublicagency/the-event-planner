import { createRoot } from 'react-dom/client';
import { LinkPreview } from './LinkPreview';
import { Node } from '@tiptap/core';

export const createLinkPreviewNodeView = (node: Node) => {
  const container = document.createElement('div');
  const preview = document.createElement('div');
  const url = node.attrs?.href;
  
  if (!url) return { dom: container };
  
  preview.setAttribute('data-url', url);
  
  // Create React root and render LinkPreview
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