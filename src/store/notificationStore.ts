
import { create } from 'zustand';
import { Notification } from '@/types/notification';
import { fetchNotificationData } from '@/api/notificationApi';
import { toast } from 'sonner';

interface NotificationState {
  // Notification data
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  
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
        description: 'Please try again later'
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
        description: 'Please try again later'
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
        description: 'Please try again later'
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
        description: 'Please try again later'
      });
    }
  }
}));
