
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

export function Toaster() {
  const { toasts } = useToast()

  // Filter to show only toasts that should appear in the default position (not sidebar)
  const defaultToasts = toasts.filter(toast => toast.position !== "sidebar");

  return (
    <ToastProvider swipeDirection="right">
      {defaultToasts.map(function ({ id, title, description, action, variant, showProgress, duration, ...props }) {
        const ToastComponent = showProgress ? ToastWithProgress : ToastWithIcon;
        
        return (
          <ToastComponent 
            key={id} 
            variant={variant} 
            {...(showProgress && { progressDuration: duration || 5000 })}
            {...props}
          >
            <div className="space-y-1">
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
      <ToastViewport />
    </ToastProvider>
  )
}
