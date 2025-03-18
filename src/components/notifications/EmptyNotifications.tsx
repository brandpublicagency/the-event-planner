
import React from 'react';

export const EmptyNotifications: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No notifications</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
        You're all caught up! Any new notifications about events, tasks, or reminders will appear here.
      </p>
    </div>
  );
};
