
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { formatNotification } from './notificationFormatters';
import { toast } from '@/hooks/use-toast';
import { Notification } from '@/types/notification';

export const useRealtimeNotifications = (
  isMountedRef: React.MutableRefObject<boolean>,
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>,
  fetchNotifications: () => Promise<void>
) => {
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
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(count => count + 1);
            
            // Show toast notification using our unified toast system
            toast({
              title: "New notification",
              description: newNotification.title,
              variant: "info"
            });
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
          
          console.log("Notification updated:", payload);
          
          try {
            const updatedNotification = formatNotification(payload.new);
            
            // Update the notification in the state
            setNotifications(prev => prev.map(notification => 
              notification.id === updatedNotification.id ? updatedNotification : notification
            ));
            
            // Update unread count if this notification was marked as read
            if (payload.new.read && !payload.old.read) {
              setUnreadCount(count => Math.max(0, count - 1));
            }
            
            // After receiving an update event, refresh the notifications list
            // to ensure proper filtering in the UI
            console.log("Refreshing notifications after status update");
            fetchNotifications().catch(err => {
              console.error("Error refreshing notifications after status update:", err);
            });
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
