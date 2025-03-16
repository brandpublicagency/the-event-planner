import * as React from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Toast, 
  ToastClose, 
  ToastDescription, 
  ToastTitle
} from "@/components/ui/toast";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, InfoIcon } from "lucide-react";

interface SidebarToastsProps {
  isCollapsed: boolean;
}

export function SidebarToasts({ isCollapsed }: SidebarToastsProps) {
  const { toast, toasts } = useToast();
  
  // Safely check if toasts exist and is an array
  if (!toasts || !Array.isArray(toasts) || toasts.length === 0) {
    return null;
  }
  
  // Only show a limited number of toasts in the sidebar
  const visibleToasts = toasts.slice(0, 2);
  
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
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