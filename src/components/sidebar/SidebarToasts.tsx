
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
  const { toasts } = useToast();
  
  // Filter toasts that should appear in the sidebar
  const sidebarToasts = toasts.filter(toast => toast.position === "sidebar");
  
  if (sidebarToasts.length === 0) return null;
  
  return (
    <div className={cn(
      "relative py-2",
      isCollapsed ? "px-2" : "px-3"
    )}>
      <AnimatePresence>
        {sidebarToasts.map(({ id, title, description, action, variant, ...props }) => {
          // Choose icon based on variant
          const IconComponent = {
            default: InfoIcon,
            destructive: AlertCircle, 
            success: CheckCircle2,
            info: InfoIcon
          }[variant || "default"];

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isCollapsed ? (
                // Collapsed sidebar - show just an icon
                <Toast 
                  className={cn(
                    "w-10 h-10 p-0 flex items-center justify-center",
                    variant === "destructive" ? "bg-red-500" : 
                    variant === "success" ? "bg-green-500" : 
                    variant === "info" ? "bg-blue-500" : "bg-primary"
                  )}
                  {...props}
                >
                  <IconComponent className="h-5 w-5 text-white" />
                  <ToastClose className="absolute top-1 right-1 p-0.5 text-white opacity-70 hover:opacity-100" />
                </Toast>
              ) : (
                // Expanded sidebar - show full toast
                <Toast 
                  className={cn(
                    "w-full border-0 backdrop-blur-sm",
                    variant === "destructive" ? "bg-red-500" : 
                    variant === "success" ? "bg-green-500" : 
                    variant === "info" ? "bg-blue-500" : "bg-primary"
                  )}
                  {...props}
                >
                  <div className="flex items-start gap-2">
                    <IconComponent className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <div className="flex-1 text-white">
                      {title && <ToastTitle className="text-white text-sm font-medium">{title}</ToastTitle>}
                      {description && <ToastDescription className="text-white/90 text-xs">{description}</ToastDescription>}
                    </div>
                  </div>
                  {action}
                  <ToastClose className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100" />
                </Toast>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
