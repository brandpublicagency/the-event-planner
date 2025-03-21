
// This file is kept for backward compatibility but is no longer needed
// Notifications are now handled directly in the NotificationContext using Supabase

import { Notification } from "@/types/notification";

/**
 * These functions are kept for backward compatibility
 * They are no longer used as we're now using Supabase realtime
 */
export const fetchNotificationData = async (): Promise<Notification[]> => {
  return [];
};

export const formatNotificationTitle = (type: string): string => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const removeDuplicateNotifications = (notifications: Notification[]): Notification[] => {
  return notifications;
};

export const formatNotifications = (notificationsData: any[]): Notification[] => {
  return [];
};

export const triggerNotificationProcessing = async (): Promise<any> => {
  return { processed: 0, created: 0 };
};
