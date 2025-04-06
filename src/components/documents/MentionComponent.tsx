
import React from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { FileIcon, CalendarDaysIcon, ClipboardListIcon, UserIcon } from 'lucide-react';

// Component to render a mention node
const MentionComponent: React.FC<NodeViewProps> = ({ node }) => {
  const { id, label, type, url } = node.attrs;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (url) {
      window.location.href = url;
    }
  };
  
  let Icon;
  switch (type) {
    case 'document':
      Icon = FileIcon;
      break;
    case 'task':
      Icon = ClipboardListIcon;
      break;
    case 'event':
      Icon = CalendarDaysIcon;
      break;
    case 'user':
      Icon = UserIcon;
      break;
    default:
      Icon = FileIcon;
  }
  
  return (
    <NodeViewWrapper>
      <span 
        className={`mention mention-${type}`}
        data-id={id}
        data-type={type}
        data-url={url}
        onClick={handleClick}
      >
        <span className="mention-icon">
          <Icon size={16} />
        </span>
        <span className="mention-title">{label}</span>
      </span>
    </NodeViewWrapper>
  );
};

export default MentionComponent;
