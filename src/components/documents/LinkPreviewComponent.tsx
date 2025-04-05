
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { LinkPreview } from './LinkPreview';

export function LinkPreviewComponent(props: NodeViewProps) {
  const url = props.node.attrs.url;
  
  return (
    <NodeViewWrapper className="link-preview-node-view">
      <LinkPreview url={url} />
    </NodeViewWrapper>
  );
}
