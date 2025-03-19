
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRealTimeNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    // Prevent duplicate subscriptions
    if (channelRef.current) {
      console.log('Real-time notification subscription already exists, skipping setup');
      return () => {};
    }

    console.log('Setting up real-time notification subscription');
    
    // Set up a subscription to notifications table
    channelRef.current = supabase
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
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return {
    isSubscribed,
    connectionStatus
  };
}
