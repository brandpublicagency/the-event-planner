
import React from 'react';
import { Bell } from 'lucide-react';

export const EmptyNotifications: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-card shadow rounded-lg">
      <Bell className="h-10 w-10 text-muted-foreground/40 mb-3" strokeWidth={1.5} />
      <h3 className="text-base font-medium text-foreground mb-1">No notifications</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        You're all caught up! Any new notifications about events, tasks, or reminders will appear here.
      </p>
    </div>
  );
};
