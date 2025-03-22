
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between overflow-hidden rounded-xl p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "toast-gradient-default",
        destructive: "toast-gradient-destructive",
        success: "toast-gradient-success",
        info: "toast-gradient-info",
        warning: "toast-gradient-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps extends 
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
  VariantProps<typeof toastVariants> {
    id?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactElement;
    duration?: number;
    position?: "top" | "bottom" | "sidebar";
    showProgress?: boolean;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
  }

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      duration={props.duration || 5000}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

export { Toast, toastVariants }
