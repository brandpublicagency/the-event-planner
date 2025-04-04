
import React from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { File, Calendar, CheckSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

// Extend NodeViewProps but override the node type
export interface MentionViewProps extends Omit<NodeViewProps, 'node'> {
  node: {
    attrs: {
      id: string;
      label: string;
      type: 'event' | 'task' | 'document';
    };
  };
}

export const MentionView: React.FC<MentionViewProps> = ({ node }) => {
  const navigate = useNavigate();
  const { id, label, type } = node.attrs;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    switch (type) {
      case 'event':
        navigate(`/event-details/${id}`);
        break;
      case 'task':
        navigate(`/task-details/${id}`);
        break;
      case 'document':
        navigate(`/documents?id=${id}`);
        break;
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'event':
        return <Calendar className="h-3.5 w-3.5 text-blue-500" />;
      case 'task':
        return <CheckSquare className="h-3.5 w-3.5 text-amber-500" />;
      case 'document':
        return <File className="h-3.5 w-3.5 text-emerald-500" />;
    }
  };
  
  const getTooltipContent = () => {
    switch (type) {
      case 'event':
        return `Event: ${label}`;
      case 'task':
        return `Task: ${label}`;
      case 'document':
        return `Document: ${label}`;
    }
  };

  return (
    <NodeViewWrapper>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <span 
              className="inline-flex items-center px-1.5 py-0.5 rounded-md text-sm bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
              contentEditable={false}
              onClick={handleClick}
              data-mention
            >
              <span className="mr-1">{getIcon()}</span>
              <span>{label}</span>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </NodeViewWrapper>
  );
};
