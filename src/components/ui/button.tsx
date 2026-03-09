
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[5px] text-xs font-mono font-light transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-slate-400 text-foreground hover:bg-foreground hover:text-background hover:border-foreground hover:[&_svg]:text-background",
        destructive:
          "bg-transparent border border-slate-400 text-destructive hover:bg-foreground hover:text-background hover:border-foreground hover:[&_svg]:text-background",
        outline:
          "bg-transparent border border-slate-400 text-foreground hover:bg-foreground hover:text-background hover:border-foreground hover:[&_svg]:text-background",
        secondary:
          "bg-transparent border border-slate-400 text-foreground hover:bg-foreground hover:text-background hover:border-foreground hover:[&_svg]:text-background",
        ghost: "hover:bg-foreground hover:text-background hover:[&_svg]:text-background",
        link: "text-foreground underline-offset-4 hover:underline",
        success: "bg-transparent border border-slate-400 text-green-800 hover:bg-foreground hover:text-background hover:border-foreground hover:[&_svg]:text-background",
      },
      size: {
        default: "h-8 px-3 py-2",
        sm: "h-7 rounded-[5px] px-2 py-1.5 text-xs",
        lg: "h-9 rounded-[5px] px-6 py-2.5",
        icon: "h-7 w-7 p-1",
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
