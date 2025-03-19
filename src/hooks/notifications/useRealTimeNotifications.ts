
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Track if a subscription already exists
let activeSubscription = false;

export function useRealTimeNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const instanceId = useRef<string>(String(Date.now()));

  useEffect(() => {
    // Prevent duplicate subscriptions across the application
    if (activeSubscription) {
      console.log('Real-time notification subscription already exists globally, skipping setup');
      setConnectionStatus('connected');
      setIsSubscribed(true);
      return () => {};
    }
    
    console.log('Setting up real-time notification subscription with ID:', instanceId.current);
    activeSubscription = true;
    
    try {
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
    } catch (err) {
      console.error('Error setting up real-time subscription:', err);
      setConnectionStatus('error');
      activeSubscription = false;
    }

    // Clean up
    return () => {
      console.log('Cleaning up real-time notification subscription:', instanceId.current);
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (err) {
          console.error('Error removing channel:', err);
        }
        channelRef.current = null;
      }
      // Only reset the global flag if this is the instance that set it
      if (activeSubscription) {
        activeSubscription = false;
      }
    };
  }, []);

  return {
    isSubscribed,
    connectionStatus
  };
}
