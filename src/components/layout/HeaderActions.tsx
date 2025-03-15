
import React from 'react';
import { SearchBar } from './SearchBar';
import { NotificationButton } from './NotificationButton';
import { ScheduledNotificationButton } from './ScheduledNotificationButton';
import { UserMenu } from './UserMenu';

export const HeaderActions = () => {
  return (
    <div className="flex items-center gap-4">
      <SearchBar />
      <NotificationButton />
      <ScheduledNotificationButton />
      <UserMenu />
    </div>
  );
};
