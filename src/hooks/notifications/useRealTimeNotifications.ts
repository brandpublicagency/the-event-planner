
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Track if a subscription already exists
let activeSubscription = false;
let lastConnectionAttempt = 0;
const CONNECTION_RETRY_INTERVAL = 15000; // 15 seconds

export function useRealTimeNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const instanceId = useRef<string>(String(Date.now()));
  const isMounted = useRef(true);

  // Cleanup function to ensure proper channel removal
  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      try {
        console.log('Removing real-time notification channel:', instanceId.current);
        supabase.removeChannel(channelRef.current);
      } catch (err) {
        console.error('Error removing channel:', err);
      }
      channelRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    // Prevent duplicate subscriptions across the application
    if (activeSubscription) {
      console.log('Real-time notification subscription already exists globally, skipping setup');
      setConnectionStatus('connected');
      setIsSubscribed(true);
      return () => {
        isMounted.current = false;
      };
    }
    
    // Rate limit connection attempts
    const now = Date.now();
    if (now - lastConnectionAttempt < CONNECTION_RETRY_INTERVAL) {
      console.log('Too many connection attempts, waiting before retrying');
      return () => {
        isMounted.current = false;
      };
    }
    
    lastConnectionAttempt = now;
    console.log('Setting up real-time notification subscription with ID:', instanceId.current);
    
    try {
      // Clean up any existing channel first
      cleanupChannel();
      
      // Set up a subscription to notifications table
      channelRef.current = supabase
        .channel(`notification-changes-${instanceId.current}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'event_notifications' 
          }, 
          (payload) => {
            if (isMounted.current) {
              console.log('Real-time notification change detected:', payload);
              // We only log the change - the actual fetch will be handled elsewhere
            }
          }
        )
        .subscribe((status) => {
          if (!isMounted.current) return;
          
          if (status === 'SUBSCRIBED') {
            activeSubscription = true;
            setIsSubscribed(true);
            setConnectionStatus('connected');
            console.log('Real-time notification subscription established');
          } else if (status === 'CHANNEL_ERROR') {
            setIsSubscribed(false);
            setConnectionStatus('error');
            console.warn('Real-time connection issue. Falling back to periodic refreshes.');
            
            // Reset active subscription on error to allow retry
            activeSubscription = false;
          }
        });
    } catch (err) {
      console.error('Error setting up real-time subscription:', err);
      if (isMounted.current) {
        setConnectionStatus('error');
      }
      activeSubscription = false;
    }

    // Clean up function
    return () => {
      console.log('Cleaning up real-time notification subscription:', instanceId.current);
      isMounted.current = false;
      cleanupChannel();
      
      // Only reset the global flag if this is the instance that set it
      if (activeSubscription && channelRef.current) {
        activeSubscription = false;
      }
    };
  }, [cleanupChannel]);

  return {
    isSubscribed,
    connectionStatus,
    cleanupSubscription: cleanupChannel
  };
}
