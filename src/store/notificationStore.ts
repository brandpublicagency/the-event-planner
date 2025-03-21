
import { create } from 'zustand';
import { Notification } from '@/types/notification';
import { supabase } from '@/integrations/supabase/client';
import { fetchNotificationData } from '@/api/notificationApi';
import { toast } from 'sonner';

interface NotificationState {
  // Notification data
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  
  // Subscription state
  isSubscribed: boolean;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  setupRealTimeSubscription: () => () => void; // Returns cleanup function
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  isSubscribed: false,
  
  // Action to fetch notifications
  fetchNotifications: async () => {
    try {
      set({ loading: true, error: null });
      const data = await fetchNotificationData();
      
      set({ 
        notifications: data, 
        unreadCount: data.filter(n => !n.read).length,
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ 
        error: error instanceof Error ? error : new Error('Failed to fetch notifications'),
        loading: false 
      });
    }
  },
  
  // Action to mark a notification as read
  markAsRead: async (id: string) => {
    try {
      // Optimistic update
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length
      }));
      
      // In a real app, you would update the database here
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      
      // Show toast notification
      toast('Notification marked as read');
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      // Revert optimistic update on error
      await get().fetchNotifications();
      
      toast('Failed to mark notification as read', {
        variant: 'destructive',
      });
    }
  },
  
  // Action to mark a notification as completed (removes it)
  markAsCompleted: async (id: string) => {
    try {
      // Optimistic update
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length
      }));
      
      // In a real app, you would update the database here
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      
      // Show toast notification
      toast('Notification completed');
      
    } catch (error) {
      console.error('Error completing notification:', error);
      
      // Revert optimistic update on error
      await get().fetchNotifications();
      
      toast('Failed to complete notification', {
        variant: 'destructive',
      });
    }
  },
  
  // Action to mark all notifications as read
  markAllAsRead: async () => {
    try {
      // Optimistic update
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
      
      // In a real app, you would update the database here
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      
      // Show toast notification
      toast('All notifications marked as read');
      
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      
      // Revert optimistic update on error
      await get().fetchNotifications();
      
      toast('Failed to mark all notifications as read', {
        variant: 'destructive',
      });
    }
  },
  
  // Action to clear all notifications
  clearNotifications: async () => {
    try {
      // Optimistic update
      set({ notifications: [], unreadCount: 0 });
      
      // In a real app, you would update the database here
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      
      // Show toast notification
      toast('All notifications cleared');
      
    } catch (error) {
      console.error('Error clearing notifications:', error);
      
      // Revert optimistic update on error
      await get().fetchNotifications();
      
      toast('Failed to clear notifications', {
        variant: 'destructive',
      });
    }
  },
  
  // Setup real-time subscription
  setupRealTimeSubscription: () => {
    console.log('Setting up real-time subscription');
    
    // Set up Supabase channel for real-time updates
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
          
          // Create a notification for the new event
          const newEvent = payload.new;
          const notificationId = `event-created-${newEvent.event_code}-${Date.now()}`;
          
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
          
          // Add to state
          set(state => {
            // Check if notification already exists to prevent duplicates
            if (state.notifications.some(n => n.id === notificationId)) {
              return state;
            }
            
            return {
              notifications: [...state.notifications, newNotification],
              unreadCount: state.unreadCount + 1
            };
          });
          
          // Show toast notification
          toast("New Event Created", {
            description: `Event "${newEvent.name}" has been added`,
          });
        }
      )
      .subscribe(status => {
        console.log('Supabase subscription status:', status);
        set({ isSubscribed: status === 'SUBSCRIBED' });
      });
      
    // Return cleanup function
    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
      set({ isSubscribed: false });
    };
  }
}));
