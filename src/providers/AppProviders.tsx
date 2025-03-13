
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { TaskProvider } from "@/contexts/TaskContext";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/contexts/NotificationContext";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <TaskProvider>
          <NotificationProvider>
            {children}
            <Toaster />
          </NotificationProvider>
        </TaskProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
