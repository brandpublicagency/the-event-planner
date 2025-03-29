
import { createContext, useContext } from "react";
import { NotificationContextType } from "@/types/notification";

// Create the context with a default value
export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  markAsRead: async () => false,
  markAsCompleted: async () => {},
  markAllAsRead: async () => false,
  clearNotifications: async () => {},
  refreshNotifications: async () => {},
  lastFilterRefresh: Date.now(),
});

export const useNotifications = () => useContext(NotificationContext);
