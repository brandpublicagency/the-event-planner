
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { formatNotification } from './notificationOperations';
import { toast } from 'sonner';
import { Notification } from '@/types/notification';

export const useRealtimeNotifications = (
  isMountedRef: React.MutableRefObject<boolean>,
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    console.log("Setting up realtime notification subscription");
    
    let channel: any;
    
    // Set up realtime subscription for new notifications
    try {
      channel = supabase
        .channel('public:notifications')
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
            
            // Show toast notification
            toast("New notification", {
              description: newNotification.title
            });
          } catch (error) {
            console.error("Error processing realtime notification:", error);
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
  }, [isMountedRef, setNotifications, setUnreadCount]);
};
