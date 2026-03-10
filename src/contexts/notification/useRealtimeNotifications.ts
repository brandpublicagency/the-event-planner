
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { formatNotification } from './notificationFormatters';
import { toast } from '@/hooks/use-toast';
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
    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        if (!isMountedRef.current) return;
        
        try {
          const newNotification = formatNotification(payload.new);
          
          setNotifications(prev => {
            const exists = prev.some(n => n.id === newNotification.id);
            if (exists) return prev;
            return [newNotification, ...prev];
          });
          
          if (!newNotification.read) {
            setUnreadCount(count => count + 1);
          }
          
          toast.success(newNotification.title);
          triggerFilterRefresh();
        } catch (error) {
          console.error("Error processing realtime notification:", error);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        if (!isMountedRef.current) return;
        
        try {
          const updatedNotification = formatNotification(payload.new);
          const oldNotificationData = payload.old;
          
          const wasUnread = oldNotificationData && !oldNotificationData.read;
          const isNowRead = updatedNotification.read;
          
          let updated = false;
          setNotifications(prev => {
            return prev.map(notification => {
              if (notification.id === updatedNotification.id) {
                updated = true;
                return updatedNotification;
              }
              return notification;
            });
          });
          
          if (wasUnread && isNowRead) {
            setUnreadCount(count => Math.max(0, count - 1));
            triggerFilterRefresh();
          }
          
          if (!updated) {
            fetchNotifications(true);
          }
        } catch (error) {
          console.error("Error processing notification update:", error);
        }
      })
      .subscribe();

    return () => {
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
