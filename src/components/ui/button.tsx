import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-zinc-100 text-zinc-900 hover:bg-zinc-900 hover:text-white before:absolute before:inset-0 before:w-[200%] before:h-[200%] before:bg-gradient-to-br before:from-white/20 before:via-white/20 before:to-transparent before:translate-x-[-100%] before:translate-y-[-100%] hover:before:animate-shine",
        destructive:
          "bg-red-100 text-red-900 hover:bg-red-900 hover:text-white before:absolute before:inset-0 before:w-[200%] before:h-[200%] before:bg-gradient-to-br before:from-white/20 before:via-white/20 before:to-transparent before:translate-x-[-100%] before:translate-y-[-100%] hover:before:animate-shine",
        outline:
          "border border-zinc-200 bg-white hover:bg-zinc-900 hover:text-white before:absolute before:inset-0 before:w-[200%] before:h-[200%] before:bg-gradient-to-br before:from-white/20 before:via-white/20 before:to-transparent before:translate-x-[-100%] before:translate-y-[-100%] hover:before:animate-shine",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-900 hover:text-white before:absolute before:inset-0 before:w-[200%] before:h-[200%] before:bg-gradient-to-br before:from-white/20 before:via-white/20 before:to-transparent before:translate-x-[-100%] before:translate-y-[-100%] hover:before:animate-shine",
        ghost: "hover:bg-zinc-900 hover:text-white before:absolute before:inset-0 before:w-[200%] before:h-[200%] before:bg-gradient-to-br before:from-white/20 before:via-white/20 before:to-transparent before:translate-x-[-100%] before:translate-y-[-100%] hover:before:animate-shine",
        link: "text-zinc-900 underline-offset-4 hover:underline",
        success: "bg-green-100 text-green-900 hover:bg-green-900 hover:text-white before:absolute before:inset-0 before:w-[200%] before:h-[200%] before:bg-gradient-to-br before:from-white/20 before:via-white/20 before:to-transparent before:translate-x-[-100%] before:translate-y-[-100%] hover:before:animate-shine",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-10 rounded-full px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }