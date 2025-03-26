
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
          actionButton: "bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-300",
          cancelButton: "bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-200",
        },
      }}
    />
  );
}
