
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { formatNotification } from './notificationFormatters';
import { toast } from 'sonner';
import { Notification } from '@/types/notification';

interface UseRealtimeNotificationsProps {
  isMountedRef: React.MutableRefObject<boolean>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  fetchNotifications: () => Promise<void>;
}

export const useRealtimeNotifications = ({
  isMountedRef,
  setNotifications,
  setUnreadCount,
  fetchNotifications
}: UseRealtimeNotificationsProps) => {
  useEffect(() => {
    console.log("Setting up realtime notification subscription");
    
    let channel: any;
    
    // Set up realtime subscription for new notifications and updates
    try {
      channel = supabase
        .channel('public:notifications')
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
            
            // Update the notification in the state
            let wasUnread = false;
            let isNowRead = false;
            
            setNotifications(prev => {
              const updated = prev.map(notification => {
                if (notification.id === updatedNotification.id) {
                  // Check if this notification was previously unread and is now read
                  wasUnread = !notification.read;
                  isNowRead = updatedNotification.read;
                  
                  console.log(`Updating notification ${updatedNotification.id} in state via realtime. Was unread: ${wasUnread}, Now read: ${isNowRead}`);
                  return updatedNotification;
                }
                return notification;
              });
              
              console.log('Updated notifications state after realtime event');
              return updated;
            });
            
            // Update unread count if this notification was marked as read
            if (wasUnread && isNowRead) {
              console.log(`Notification ${payload.new.id} was marked as read, updating unread count`);
              setUnreadCount(count => Math.max(0, count - 1));
            }
            
            // Force a full refresh to ensure consistent state after a brief delay
            setTimeout(() => {
              console.log("Refreshing notifications after realtime update");
              fetchNotifications().catch(err => {
                console.error("Error refreshing notifications after realtime update:", err);
              });
            }, 500);
          } catch (error) {
            console.error("Error processing notification update:", error);
          }
        })
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
        });
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
    }

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
  }, [isMountedRef, setNotifications, setUnreadCount, fetchNotifications]);
};
