
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-center"
      expand={false}
      richColors={false}
      closeButton
      toastOptions={{
        duration: 5000,
        className: "rounded-md border shadow-md",
        classNames: {
          title: "font-semibold text-foreground",
          description: "text-muted-foreground text-sm",
          actionButton: "bg-primary text-primary-foreground text-xs px-2 py-1 rounded",
          cancelButton: "bg-muted text-muted-foreground text-xs px-2 py-1 rounded",
        },
      }}
    />
  );
}
