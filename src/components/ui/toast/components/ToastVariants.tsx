
import * as React from "react"
import { Toast, ToastProps } from "./Toast"
import { ToastIcon } from "./ToastIcon"

export interface ToastWithProgressProps extends ToastProps {
  progressDuration?: number;
}

const ToastWithIcon = React.forwardRef<
  React.ElementRef<typeof Toast>,
  React.ComponentPropsWithoutRef<typeof Toast>
>(({ children, variant, ...props }, ref) => {
  return (
    <Toast ref={ref} variant={variant} {...props}>
      <div className="flex items-center">
        <ToastIcon variant={variant} />
        <div className="flex flex-col gap-1">
          {children}
        </div>
      </div>
    </Toast>
  );
});
ToastWithIcon.displayName = "ToastWithIcon";

const ToastWithProgress = React.forwardRef<
  React.ElementRef<typeof Toast>,
  ToastWithProgressProps
>(({ children, variant, progressDuration = 5000, ...props }, ref) => {
  return (
    <Toast ref={ref} variant={variant} {...props}>
      <div className="flex items-center w-full">
        <ToastIcon variant={variant} />
        <div className="flex flex-col gap-1 w-full">
          {children}
        </div>
      </div>
      <div 
        className="toast-progress-bar" 
        style={{ 
          animationDuration: `${progressDuration}ms`,
          animationName: 'toast-progress-animation'
        }}
      />
    </Toast>
  );
});
ToastWithProgress.displayName = "ToastWithProgress";

export { ToastWithIcon, ToastWithProgress }
