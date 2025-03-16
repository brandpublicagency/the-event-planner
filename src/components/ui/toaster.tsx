
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

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(function ({ id, title, description, action, variant, showProgress, duration, ...props }) {
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
