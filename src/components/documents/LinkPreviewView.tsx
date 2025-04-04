
import { NodeViewWrapper } from '@tiptap/react';
import { LinkPreview } from './LinkPreview';

export const LinkPreviewView = ({ node }: any) => {
  const url = node.attrs.url;

  return (
    <NodeViewWrapper className="link-preview-node my-4">
      <LinkPreview url={url} />
    </NodeViewWrapper>
  );
};
