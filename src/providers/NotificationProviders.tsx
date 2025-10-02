import React from 'react';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NotificationPreferencesProvider } from '@/contexts/NotificationPreferencesContext';

export const NotificationProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotificationPreferencesProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </NotificationPreferencesProvider>
  );
};
