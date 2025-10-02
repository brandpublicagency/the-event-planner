import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface NotificationPreferences {
  toastDuration: number;
  enableSounds: boolean;
  enableGrouping: boolean;
  filterTypes: string[];
}

interface NotificationPreferencesContextType {
  preferences: NotificationPreferences;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
}

const defaultPreferences: NotificationPreferences = {
  toastDuration: 4000,
  enableSounds: false,
  enableGrouping: true,
  filterTypes: [],
};

const NotificationPreferencesContext = createContext<NotificationPreferencesContextType | undefined>(
  undefined
);

export const NotificationPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    const stored = localStorage.getItem('notificationPreferences');
    return stored ? JSON.parse(stored) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  return (
    <NotificationPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </NotificationPreferencesContext.Provider>
  );
};

export const useNotificationPreferences = () => {
  const context = useContext(NotificationPreferencesContext);
  if (!context) {
    throw new Error('useNotificationPreferences must be used within NotificationPreferencesProvider');
  }
  return context;
};
