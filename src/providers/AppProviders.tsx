
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { TaskProvider } from "@/contexts/TaskContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/toast";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong:</h2>
      <pre className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-w-lg text-sm">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <QueryClientProvider client={queryClient}>
          <TaskProvider>
            <NotificationProvider>
              {children}
              {/* Single toast provider for the entire app */}
              <Toaster />
            </NotificationProvider>
          </TaskProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
