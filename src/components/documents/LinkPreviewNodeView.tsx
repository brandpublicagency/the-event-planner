import { createRoot } from 'react-dom/client';
import { LinkPreview } from './LinkPreview';
import type { NodeViewRenderer } from '@tiptap/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const createLinkPreviewNodeView: NodeViewRenderer = (props) => {
  const container = document.createElement('div');
  const preview = document.createElement('div');
  const attrs = props.node.attrs as { href?: string };
  const url = attrs?.href;
  
  if (!url) return { dom: container };
  
  preview.setAttribute('data-url', url);
  
  const root = createRoot(preview);
  root.render(
    <QueryClientProvider client={queryClient}>
      <LinkPreview url={url} />
    </QueryClientProvider>
  );
  
  container.appendChild(preview);
  
  return {
    dom: container,
    destroy: () => {
      root.unmount();
    },
  };
};