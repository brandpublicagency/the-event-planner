
import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastWithIcon,
  ToastWithProgress,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

interface SidebarToastsProps {
  isCollapsed?: boolean;
}

export function SidebarToasts({ isCollapsed }: SidebarToastsProps) {
  const { toasts } = useToast()

  // Only show toasts that should appear in the sidebar
  const sidebarToasts = toasts.filter(toast => toast.position === "sidebar");

  if (sidebarToasts.length === 0) {
    return null;
  }

  return (
    <ToastProvider>
      {sidebarToasts.map(function ({ id, title, description, action, variant = "default", showProgress = false, duration = 5000, ...props }) {
        const ToastComponent = showProgress ? ToastWithProgress : ToastWithIcon;
        
        return (
          <ToastComponent 
            key={id} 
            variant={variant as "default" | "destructive" | "success" | "info"} 
            {...(showProgress && { progressDuration: duration })}
            {...props}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </ToastComponent>
        )
      })}
      <ToastViewport className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-0 sm:right-0 sm:bottom-auto sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}
