
import React from 'react';
import { Calendar, CheckSquare, File, User } from 'lucide-react';

interface MentionIconProps {
  type: string;
  className?: string;
}

export const MentionIcon: React.FC<MentionIconProps> = ({ type, className = "h-3 w-3" }) => {
  switch (type) {
    case 'event':
      return <Calendar className={className} />;
    case 'task':
      return <CheckSquare className={className} />;
    case 'document':
      return <File className={className} />;
    case 'user':
      return <User className={className} />;
    default:
      return null;
  }
};
