
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
        duration: 4000,
        className: "plain-toast",
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#f8f8f8] group-[.toaster]:text-foreground group-[.toaster]:border-[#e2e8f0]",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-gray-200 group-[.toast]:text-gray-800 hover:group-[.toast]:bg-gray-300",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 hover:group-[.toast]:bg-gray-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
