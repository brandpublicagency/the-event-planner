
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      expand={false}
      richColors={false}
      closeButton
      toastOptions={{
        duration: 3000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-sm group-[.toaster]:rounded-md group-[.toaster]:text-sm",
          title: "group-[.toast]:font-medium group-[.toast]:text-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          closeButton:
            "group-[.toast]:text-muted-foreground group-[.toast]:border-border",
          error:
            "group-[.toaster]:bg-background group-[.toaster]:text-destructive group-[.toaster]:border-destructive/20",
          success:
            "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
          warning:
            "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
          info:
            "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
