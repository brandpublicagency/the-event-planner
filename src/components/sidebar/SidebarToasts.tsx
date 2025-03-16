
import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, InfoIcon, X } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

// Define a self-contained toast type
interface SidebarToast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  createdAt: Date;
}

interface SidebarToastsProps {
  isCollapsed: boolean;
}

export function SidebarToasts({ isCollapsed }: SidebarToastsProps) {
  // Use the notification context to get real notifications
  const { notifications, unreadCount } = useNotifications();
  
  // Maintain our own toast state independent of the app's toast system
  const [sidebarToasts, setSidebarToasts] = useState<SidebarToast[]>([]);
  
  // Convert notifications to sidebar toasts when they change
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Take the most recent unread notification and display it as a toast
      const unreadNotifications = notifications.filter(n => !n.read).slice(0, 2);
      
      if (unreadNotifications.length > 0) {
        const toasts = unreadNotifications.map(notification => ({
          id: notification.id,
          title: notification.title,
          description: notification.description,
          variant: notification.type.includes('error') ? 'destructive' : 
                  (notification.type.includes('created') ? 'success' : 'default'),
          createdAt: notification.createdAt
        }));
        
        setSidebarToasts(prev => {
          // Deduplicate by id
          const existingIds = new Set(prev.map(t => t.id));
          const newToasts = toasts.filter(t => !existingIds.has(t.id));
          
          if (newToasts.length === 0) return prev;
          return [...newToasts, ...prev].slice(0, 5); // Keep maximum 5 toasts
        });
      }
    }
  }, [notifications]);
  
  // Create a fallback toast if no notifications are available
  useEffect(() => {
    // If there are no notifications and no toasts, create a fallback toast
    if ((!notifications || notifications.length === 0) && sidebarToasts.length === 0) {
      // Create a fallback toast for first-time users
      const createFallbackToast = () => {
        const newToast: SidebarToast = {
          id: `welcome-toast-${Date.now()}`,
          title: "Welcome to WarmKaroo",
          description: "Create your first event by clicking the 'New Event' button",
          variant: "success",
          createdAt: new Date()
        };
        
        setSidebarToasts(prev => [...prev, newToast]);
      };
      
      // Create fallback toast after 1 second
      const timeout = setTimeout(createFallbackToast, 1000);
      
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [notifications, sidebarToasts.length]);
  
  // Clean up old toasts automatically
  useEffect(() => {
    if (sidebarToasts.length === 0) return;
    
    // For each toast, set a timeout to remove it
    const timeouts = sidebarToasts.map(toast => {
      return setTimeout(() => {
        setSidebarToasts(prev => 
          prev.filter(t => t.id !== toast.id)
        );
      }, 4000); // Dismiss after 4 seconds
    });
    
    // Clean up timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [sidebarToasts]);
  
  // Function to dismiss a toast manually
  const dismissToast = (id: string) => {
    setSidebarToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // If no toasts, don't render anything
  if (sidebarToasts.length === 0) return null;
  
  return (
    <div className={cn(
      "relative py-2",
      isCollapsed ? "px-2" : "px-3"
    )}>
      <AnimatePresence mode="popLayout">
        {sidebarToasts.map((toast) => {
          // Choose icon based on variant
          let IconComponent = InfoIcon;
          if (toast.variant === "destructive") IconComponent = AlertCircle;
          else if (toast.variant === "success") IconComponent = CheckCircle2;
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ 
                opacity: 0, 
                y: -10, 
                height: 0,
                transition: { 
                  opacity: { duration: 0.2 },
                  height: { delay: 0.2, duration: 0.2 } 
                }
              }}
              transition={{ duration: 0.3 }}
              className="mb-2 overflow-hidden"
            >
              {isCollapsed ? (
                // Collapsed sidebar - show just an icon
                <div 
                  className={cn(
                    "w-10 h-10 rounded-md p-0 flex items-center justify-center relative",
                    toast.variant === "destructive" ? "bg-red-100 text-red-700" : 
                    toast.variant === "success" ? "bg-green-100 text-green-700" : 
                    "bg-blue-100 text-blue-700"
                  )}
                >
                  <IconComponent className="h-5 w-5" />
                  <button 
                    onClick={() => dismissToast(toast.id)} 
                    className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              ) : (
                // Expanded sidebar - show full toast
                <div 
                  className={cn(
                    "w-full rounded-md px-3 py-2 relative",
                    toast.variant === "destructive" ? "bg-red-100 text-red-700" : 
                    toast.variant === "success" ? "bg-green-100 text-green-700" : 
                    "bg-blue-100 text-blue-700"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      {toast.title && <div className="text-sm font-medium">{toast.title}</div>}
                      {toast.description && <div className="text-xs opacity-90">{toast.description}</div>}
                    </div>
                    <button 
                      onClick={() => dismissToast(toast.id)} 
                      className="h-5 w-5 rounded hover:bg-white/50 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
