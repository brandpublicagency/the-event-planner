
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useRealTimeNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const { toast } = useToast();

  useEffect(() => {
    // Set up a subscription to notifications table
    const channel = supabase
      .channel('notification-status')
      .on('presence', { event: 'sync' }, () => {
        setIsSubscribed(true);
        setConnectionStatus('connected');
        console.log('Real-time notification subscription established');
      })
      .on('presence', { event: 'join' }, () => {
        setIsSubscribed(true);
        setConnectionStatus('connected');
      })
      .on('presence', { event: 'leave' }, () => {
        setConnectionStatus('disconnected');
      })
      .on('system', { event: 'disconnect' }, () => {
        setIsSubscribed(false);
        setConnectionStatus('disconnected');
        console.warn('Disconnected from real-time notifications');
      })
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'event_notifications' 
        }, 
        (payload) => {
          console.log('Real-time notification change detected:', payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
          setConnectionStatus('connected');
        } else if (status === 'CHANNEL_ERROR') {
          setIsSubscribed(false);
          setConnectionStatus('error');
          
          // Show toast for real-time connection error
          toast({
            title: 'Real-time Connection Issue',
            description: 'Could not establish a real-time connection. Notifications may be delayed.',
            variant: 'info',  // Changed from 'warning' to 'info' to match allowed variants
            duration: 5000,
          });
        }
      });

    // Clean up
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return {
    isSubscribed,
    connectionStatus
  };
}
