
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Notification, NotificationContextType } from "@/types/notification";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

// Create context with default values
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Use state for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Calculate unread count - memoized to prevent recalculation
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);
  
  // Listen for new events from Supabase Realtime
  useEffect(() => {
    console.log('Setting up event notification subscription');
    
    // Subscribe to events table for real-time notifications
    const channel = supabase
      .channel('event-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('New event detected:', payload);
          
          if (!payload.new) {
            console.error('Payload missing new event data');
            return;
          }
          
          // Add new event notification
          const newEvent = payload.new;
          const notificationId = `event-created-${newEvent.event_code}-${Date.now()}`;
          
          console.log('Creating notification with ID:', notificationId);
          
          const newNotification = {
            id: notificationId,
            title: "New Event Created",
            description: `New event "${newEvent.name}" has been created`,
            createdAt: new Date(),
            type: "event_created",
            read: false,
            actionType: "review",
            relatedId: newEvent.event_code
          };
          
          // Check for duplicates before adding
          setNotifications(prev => {
            // Don't add duplicate notifications
            if (prev.some(n => n.id === notificationId)) {
              console.log('Duplicate notification, not adding:', notificationId);
              return prev;
            }
            
            console.log('Adding new notification:', newNotification);
            return [...prev, newNotification];
          });
          
          // Also show a toast notification
          toast("New Event Created", {
            description: `Event "${newEvent.name}" has been added`,
          });
        }
      )
      .subscribe();
      
    // Cleanup subscription
    return () => {
      console.log('Cleaning up event notification subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  // Also, let's fetch any new events from the last 24 hours to show as notifications
  useEffect(() => {
    const fetchRecentEvents = async () => {
      setLoading(true);
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const { data, error } = await supabase
          .from('events')
          .select('event_code, name, created_at')
          .gte('created_at', yesterday.toISOString())
          .order('created_at', { ascending: false })
          .limit(5); // Limit to 5 recent events
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log('Found recent events:', data);
          
          // Add each recent event as a notification if it doesn't exist already
          setNotifications(prev => {
            const newNotifications = data
              .filter(event => !prev.some(n => n.relatedId === event.event_code && n.type === 'event_created'))
              .map(event => ({
                id: `event-created-${event.event_code}-${Date.now()}`,
                title: "New Event Created",
                description: `New event "${event.name}" has been created`,
                createdAt: new Date(event.created_at),
                type: "event_created",
                read: false,
                actionType: "review",
                relatedId: event.event_code
              }));
              
            if (newNotifications.length === 0) {
              return prev;
            }
            
            console.log('Adding notifications for recent events:', newNotifications);
            return [...prev, ...newNotifications];
          });
        }
      } catch (error) {
        console.error('Error fetching recent events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentEvents();
  }, []);
  
  // Mark a notification as read
  const markAsRead = async (id: string): Promise<void> => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    return Promise.resolve();
  };
  
  // Mark a notification as completed (remove it)
  const markAsCompleted = async (id: string): Promise<void> => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    return Promise.resolve();
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast('All notifications marked as read');
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    toast('All notifications cleared');
  };
  
  // Refresh notifications
  const refreshNotifications = async (): Promise<void> => {
    // This is just a placeholder for the interface compatibility
    // The actual refreshing is handled by the Supabase realtime subscription
    return Promise.resolve();
  };

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(() => ({
    notifications, 
    unreadCount,
    markAsRead, 
    markAsCompleted,
    markAllAsRead,
    clearNotifications,
    refreshNotifications
  }), [
    notifications, 
    unreadCount
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
