
import * as React from "react"
import { CheckCircle2, AlertCircle, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastIconProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "info" | "warning";
}

const ToastIcon = React.forwardRef<
  HTMLDivElement,
  ToastIconProps
>(({ className, variant = "default", ...props }, ref) => {
  const IconComponent = {
    default: InfoIcon,
    destructive: AlertCircle,
    success: CheckCircle2,
    info: InfoIcon,
    warning: AlertCircle
  }[variant];

  return (
    <div
      ref={ref}
      className={cn("mr-3 flex-shrink-0", className)}
      {...props}
    >
      <IconComponent className="h-5 w-5 text-white" />
    </div>
  );
});
ToastIcon.displayName = "ToastIcon";

export { ToastIcon }
