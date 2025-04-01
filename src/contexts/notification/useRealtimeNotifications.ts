
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { formatNotification } from './notificationFormatters';
import { toast } from 'sonner';
import { Notification } from '@/types/notification';

interface UseRealtimeNotificationsProps {
  isMountedRef: React.MutableRefObject<boolean>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  fetchNotifications: (force?: boolean) => Promise<void>;
  triggerFilterRefresh: () => void;
}

export const useRealtimeNotifications = ({
  isMountedRef,
  setNotifications,
  setUnreadCount,
  fetchNotifications,
  triggerFilterRefresh
}: UseRealtimeNotificationsProps) => {
  useEffect(() => {
    console.log("Setting up realtime notification subscription");
    
    // Create a channel for real-time notifications
    const channel = supabase
      .channel('notifications-realtime')
      // Subscribe to INSERT events for new notifications
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        if (!isMountedRef.current) return;
        
        console.log("New notification received:", payload);
        
        try {
          const newNotification = formatNotification(payload.new);
          
          // Update notifications list with the new notification
          setNotifications(prev => {
            // Check if notification already exists to avoid duplicates
            const exists = prev.some(n => n.id === newNotification.id);
            if (exists) {
              console.log(`Notification ${newNotification.id} already exists in state, skipping`);
              return prev;
            }
            
            console.log(`Adding new notification ${newNotification.id} to state`);
            return [newNotification, ...prev];
          });
          
          // Update unread count if the notification is unread
          if (!newNotification.read) {
            setUnreadCount(count => count + 1);
          }
          
          // Show toast notification - using the correct format for sonner
          toast.success(newNotification.title);
          
          // Trigger filter refresh to update UI
          triggerFilterRefresh();
        } catch (error) {
          console.error("Error processing realtime notification:", error);
        }
      })
      // Subscribe to UPDATE events for notification status changes
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        if (!isMountedRef.current) return;
        
        console.log("Notification updated via realtime:", payload);
        
        try {
          const updatedNotification = formatNotification(payload.new);
          const oldNotificationData = payload.old;
          
          // Check if this is a read status change
          const wasUnread = oldNotificationData && !oldNotificationData.read;
          const isNowRead = updatedNotification.read;
          
          console.log(`Realtime update - Was unread: ${wasUnread}, Now read: ${isNowRead}`);
          
          // Update the notification in the state first
          let updated = false;
          setNotifications(prev => {
            return prev.map(notification => {
              if (notification.id === updatedNotification.id) {
                console.log(`Updating notification ${updatedNotification.id} in state via realtime`);
                updated = true;
                return updatedNotification;
              }
              return notification;
            });
          });
          
          // Then update the unread count if needed
          if (wasUnread && isNowRead) {
            // Update the unread count when a notification is marked as read
            setUnreadCount(count => Math.max(0, count - 1));
            console.log(`Notification ${updatedNotification.id} was marked as read, updating unread count`);
            
            // Trigger a filter refresh to ensure UI updates correctly
            triggerFilterRefresh();
          }
          
          // If we didn't find the notification in our state, fetch all to sync
          if (!updated) {
            console.log("Updated notification not found in current state, fetching fresh data");
            fetchNotifications(true);
          }
        } catch (error) {
          console.error("Error processing notification update:", error);
        }
      })
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up realtime subscription");
      
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error("Error removing channel:", error);
        }
      }
    };
  }, [isMountedRef, setNotifications, setUnreadCount, fetchNotifications, triggerFilterRefresh]);
};
