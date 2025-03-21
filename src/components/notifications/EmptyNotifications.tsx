
import React from 'react';
import { Bell } from 'lucide-react';

export const EmptyNotifications: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white">
      <Bell className="h-10 w-10 text-zinc-300 mb-3" strokeWidth={1.5} />
      <h3 className="text-base font-medium text-zinc-900 mb-1">No notifications</h3>
      <p className="text-sm text-zinc-500 max-w-md">
        You're all caught up! Any new notifications about events, tasks, or reminders will appear here.
      </p>
    </div>
  );
};
