
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTaskContext } from "./TaskContext";
import { addDays, isPast, isFuture } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export type NotificationType = 
  | "event_created" 
  | "task_overdue" 
  | "task_upcoming" 
  | "event_incomplete"
  | "task_created";

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  type: NotificationType;
  read: boolean;
  actionType?: "review" | "approve";
  relatedId?: string; // event_code or task_id
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { tasks } = useTaskContext();
  const { toast } = useToast();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Process tasks for notifications
  useEffect(() => {
    const processTaskNotifications = () => {
      const newNotifications: Notification[] = [];
      const today = new Date();
      
      // Find overdue tasks
      const overdueTasks = tasks.filter(task => {
        if (!task.due_date || task.completed) return false;
        const dueDate = new Date(task.due_date);
        return isPast(dueDate) && !task.completed;
      });
      
      // Find upcoming tasks due in the next 3 days
      const upcomingTasks = tasks.filter(task => {
        if (!task.due_date || task.completed) return false;
        const dueDate = new Date(task.due_date);
        const threeDaysFromNow = addDays(today, 3);
        return isFuture(dueDate) && dueDate <= threeDaysFromNow;
      });
      
      // Create notifications for overdue tasks
      overdueTasks.forEach(task => {
        newNotifications.push({
          id: `task-overdue-${task.id}`,
          title: "Task Overdue",
          description: `"${task.title}" is past due`,
          createdAt: new Date(),
          type: "task_overdue",
          read: false,
          actionType: "review",
          relatedId: task.id
        });
      });
      
      // Create notifications for upcoming tasks
      upcomingTasks.forEach(task => {
        newNotifications.push({
          id: `task-upcoming-${task.id}`,
          title: "Upcoming Task",
          description: `"${task.title}" is due soon`,
          createdAt: new Date(),
          type: "task_upcoming",
          read: false,
          actionType: "review",
          relatedId: task.id
        });
      });
      
      // Merge with existing notifications, avoid duplicates
      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const filteredNew = newNotifications.filter(n => !existingIds.includes(n.id));
        return [...prev, ...filteredNew];
      });
    };
    
    processTaskNotifications();
  }, [tasks]);
  
  // Subscribe to new events
  useEffect(() => {
    // Subscribe to events table
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
          // Add new event notification
          const newEvent = payload.new;
          const newNotification = {
            id: `event-created-${newEvent.event_code}`,
            title: "New Event",
            description: `New event "${newEvent.name}" has been created`,
            createdAt: new Date(),
            type: "event_created" as NotificationType,
            read: false,
            actionType: "review" as const,
            relatedId: newEvent.event_code
          };
          
          setNotifications(prev => [
            ...prev,
            newNotification
          ]);
          
          // Also show a toast notification
          toast({
            title: "New Event Created",
            description: `Event "${newEvent.name}" has been added`,
            variant: "info",
            showProgress: true
          });
        }
      )
      .subscribe();
      
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  // Subscribe to new tasks
  useEffect(() => {
    // Subscribe to tasks table
    const channel = supabase
      .channel('task-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          // Add new task notification
          const newTask = payload.new;
          const newNotification = {
            id: `task-created-${newTask.id}`,
            title: "New Task",
            description: `New task "${newTask.title}" has been created`,
            createdAt: new Date(),
            type: "task_created" as NotificationType,
            read: false,
            actionType: "review" as const,
            relatedId: newTask.id
          };
          
          setNotifications(prev => [
            ...prev,
            newNotification
          ]);
          
          // Also show a toast notification
          toast({
            title: "New Task Created",
            description: `Task "${newTask.title}" has been added`,
            variant: "info",
            showProgress: true
          });
        }
      )
      .subscribe();
      
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  // Check for incomplete events
  useEffect(() => {
    const checkIncompleteEvents = async () => {
      // Get today's date
      const today = new Date();
      
      // Get date 14 days from now
      const futureDate = addDays(today, 14);
      
      try {
        // Fetch upcoming events in the next 14 days
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .gt('event_date', today.toISOString().split('T')[0])
          .lt('event_date', futureDate.toISOString().split('T')[0]);
          
        if (error) {
          console.error('Error fetching events for notification check:', error);
          return;
        }
        
        // Check for incomplete events
        const incompleteEvents = events?.filter(event => {
          // Check for missing important fields
          return !event.venues?.length || !event.primary_name || !event.pax;
        });
        
        // Create notifications for incomplete events
        if (incompleteEvents?.length) {
          const incompleteNotifications = incompleteEvents.map(event => ({
            id: `event-incomplete-${event.event_code}`,
            title: "Incomplete Event",
            description: `Event "${event.name}" is missing critical information`,
            createdAt: new Date(),
            type: "event_incomplete" as NotificationType,
            read: false,
            actionType: "review" as const,
            relatedId: event.event_code
          }));
          
          // Add to notifications list
          setNotifications(prev => {
            const existingIds = prev.map(n => n.id);
            const filteredNew = incompleteNotifications.filter(n => !existingIds.includes(n.id));
            return [...prev, ...filteredNew];
          });
        }
      } catch (err) {
        console.error('Error in checkIncompleteEvents:', err);
      }
    };
    
    // Run once when component mounts
    checkIncompleteEvents();
    
    // Set interval to check every hour
    const interval = setInterval(checkIncompleteEvents, 3600000);
    
    return () => clearInterval(interval);
  }, []);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount,
        markAsRead, 
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
