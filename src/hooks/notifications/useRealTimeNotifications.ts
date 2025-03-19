
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRealTimeNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');

  useEffect(() => {
    // Set up a subscription to notifications table
    const channel = supabase
      .channel('notification-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'event_notifications' 
        }, 
        (payload) => {
          console.log('Real-time notification change detected:', payload);
          // We only log the change - the actual fetch will be handled elsewhere
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
          setConnectionStatus('connected');
          console.log('Real-time notification subscription established');
        } else if (status === 'CHANNEL_ERROR') {
          setIsSubscribed(false);
          setConnectionStatus('error');
          console.warn('Real-time connection issue. Falling back to periodic refreshes.');
        }
      });

    // Clean up
    return () => {
      console.log('Cleaning up real-time notification subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    isSubscribed,
    connectionStatus
  };
}
