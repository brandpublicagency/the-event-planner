
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[5px] text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-zinc-800 text-zinc-800 hover:bg-zinc-900 hover:text-white",
        destructive:
          "bg-transparent border border-red-800 text-red-800 hover:bg-red-900 hover:text-white",
        outline:
          "bg-transparent border border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900",
        secondary:
          "bg-transparent border border-zinc-800 text-zinc-800 hover:bg-zinc-900 hover:text-white",
        ghost: "hover:bg-zinc-100 hover:text-zinc-900",
        link: "text-zinc-900 underline-offset-4 hover:underline",
        success: "bg-transparent border border-green-800 text-green-800 hover:bg-green-900 hover:text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded-[5px] px-2.5 text-xs",
        lg: "h-10 rounded-[5px] px-8",
        icon: "h-8 w-8 p-1",
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
