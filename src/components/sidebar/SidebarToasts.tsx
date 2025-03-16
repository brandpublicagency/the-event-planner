import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, InfoIcon, X } from "lucide-react";

interface SidebarToastsProps {
  isCollapsed: boolean;
}

export function SidebarToasts({ isCollapsed }: SidebarToastsProps) {
  const { toast, toasts, dismissToast } = useToast();
  // Keep track of visible toasts in local state
  const [visibleToasts, setVisibleToasts] = useState<any[]>([]);

  // Update visible toasts when toasts prop changes
  useEffect(() => {
    if (!toasts || !Array.isArray(toasts)) {
      setVisibleToasts([]);
      return;
    }
    // Only show up to 2 most recent toasts
    setVisibleToasts(toasts.slice(0, 2));
  }, [toasts]);

  // Set up auto-dismissal of toasts
  useEffect(() => {
    if (visibleToasts.length === 0) return;
    
    // Set timeouts to auto-dismiss each toast
    const timeouts = visibleToasts.map(toast => {
      return setTimeout(() => {
        if (toast && toast.id && dismissToast) {
          dismissToast(toast.id);
        }
      }, 5000); // Auto-dismiss after 5 seconds
    });
    
    // Clean up timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [visibleToasts, dismissToast]);

  if (visibleToasts.length === 0) return null;
  
  return (
    <div className={cn(
      "relative py-2",
      isCollapsed ? "px-2" : "px-3"
    )}>
      <AnimatePresence>
        {visibleToasts.map((toast) => {
          if (!toast || !toast.id) return null;
          
          const { id, title, description, variant } = toast;
          
          // Choose icon based on variant
          let IconComponent = InfoIcon;
          if (variant === "destructive") IconComponent = AlertCircle;
          else if (variant === "success") IconComponent = CheckCircle2;
          
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              {isCollapsed ? (
                // Collapsed sidebar - show just an icon
                <div 
                  className={cn(
                    "w-10 h-10 rounded-md p-0 flex items-center justify-center relative",
                    variant === "destructive" ? "bg-red-100 text-red-700" : 
                    variant === "success" ? "bg-green-100 text-green-700" : 
                    "bg-blue-100 text-blue-700"
                  )}
                >
                  <IconComponent className="h-5 w-5" />
                  <button 
                    onClick={() => dismissToast && dismissToast(id)} 
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
                    variant === "destructive" ? "bg-red-100 text-red-700" : 
                    variant === "success" ? "bg-green-100 text-green-700" : 
                    "bg-blue-100 text-blue-700"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      {title && <div className="text-sm font-medium">{title}</div>}
                      {description && <div className="text-xs opacity-90">{description}</div>}
                    </div>
                    <button 
                      onClick={() => dismissToast && dismissToast(id)} 
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