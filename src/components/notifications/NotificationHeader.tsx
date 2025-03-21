
import React from 'react';
import { Bell, Calendar, FileText, CheckSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NotificationHeaderProps {
  count: number;
  listType?: string;
}

export const NotificationHeader = ({ count, listType = 'default' }: NotificationHeaderProps) => {
  const getIcon = () => {
    switch (listType) {
      case 'events': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'tasks': return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case 'documents': return <FileText className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (listType) {
      case 'unified':
        return 'All Notifications';
      case 'unread':
        return 'Unread Notifications';
      case 'tasks':
        return 'Task Notifications';
      case 'events':
        return 'Event Notifications';
      case 'documents':
        return 'Document Notifications';
      case 'scheduled':
        return 'Scheduled Reminders';
      case 'general':
        return 'General Notifications';
      default:
        return 'Notifications';
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        {getIcon()}
        <h3 className="font-medium text-sm">{getTitle()}</h3>
        <Badge variant="secondary" className="ml-1 px-2 py-0 h-5 text-xs bg-zinc-100 text-zinc-700 border border-zinc-200">
          {count}
        </Badge>
      </div>
    </div>
  );
};
