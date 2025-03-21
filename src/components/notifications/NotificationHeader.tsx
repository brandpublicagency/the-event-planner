
import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationHeaderProps {
  count: number;
  listType?: string;
}

export const NotificationHeader = ({ count, listType = 'default' }: NotificationHeaderProps) => {
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
      default:
        return 'Notifications';
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-primary" />
        <h3 className="font-medium">{getTitle()}</h3>
        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
    </div>
  );
};
