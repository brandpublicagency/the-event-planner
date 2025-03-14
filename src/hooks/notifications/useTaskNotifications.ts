
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationType } from "@/types/notification";
import { useToast } from "@/hooks/use-toast";
import { addDays, isPast, isFuture } from "date-fns";

export function useTaskNotifications(
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  tasks: any[]
) {
  const { toast } = useToast();

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
  }, [tasks, setNotifications]);

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
          const notificationId = `task-created-${newTask.id}`;
          
          const newNotification = {
            id: notificationId,
            title: "New Task",
            description: `New task "${newTask.title}" has been created`,
            createdAt: new Date(),
            type: "task_created" as NotificationType,
            read: false,
            actionType: "review" as const,
            relatedId: newTask.id
          };
          
          // Check for duplicates before adding
          setNotifications(prev => {
            // Don't add duplicate notifications
            if (prev.some(n => n.id === notificationId)) {
              return prev;
            }
            
            return [...prev, newNotification];
          });
          
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
  }, [toast, setNotifications]);
}
