
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right"
      expand={false}
      richColors={false}
      closeButton
      toastOptions={{
        duration: 4000,
        className: "plain-toast",
        classNames: {
          title: "font-medium text-gray-900 text-sm",
          description: "text-gray-600 text-xs",
          actionButton: "bg-gray-900 text-white text-xs px-2 py-1 rounded",
          cancelButton: "bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded",
        },
      }}
    />
  );
}
