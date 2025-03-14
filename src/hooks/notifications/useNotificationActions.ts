
import { Dispatch, SetStateAction } from "react";
import { Notification } from "@/types/notification";

export function useNotificationActions(
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) {
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
}
