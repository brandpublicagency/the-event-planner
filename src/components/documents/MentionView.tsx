
import React from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { Calendar, CheckSquare, File, User } from 'lucide-react';
import { MentionItem } from './MentionSelector';

// Making this compatible with NodeViewProps
export const MentionView: React.FC<NodeViewProps> = (props) => {
  const { id, label, type } = props.node.attrs as MentionItem;
  
  // Function to get the appropriate icon based on mention type
  const getMentionIcon = () => {
    switch (type) {
      case 'event':
        return <Calendar className="h-3.5 w-3.5" />;
      case 'task':
        return <CheckSquare className="h-3.5 w-3.5" />;
      case 'document':
        return <File className="h-3.5 w-3.5" />;
      case 'user':
        return <User className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };
  
  // Determine the color class based on mention type
  const getColorClass = () => {
    switch (type) {
      case 'event':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'task':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'document':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'user':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <NodeViewWrapper as="span">
      <span
        data-mention=""
        data-id={id}
        data-type={type}
        className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium border ${getColorClass()}`}
      >
        <span className="mr-1">{getMentionIcon()}</span>
        {label}
      </span>
    </NodeViewWrapper>
  );
};
