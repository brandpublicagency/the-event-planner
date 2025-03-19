
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { TaskProvider } from "@/contexts/TaskContext";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ScheduledNotificationProvider } from "@/contexts/ScheduledNotificationContext";
import { ToastProvider } from "@/components/ui/toast/toast-context";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <TaskProvider>
            <NotificationProvider>
              <ScheduledNotificationProvider>
                {children}
                <Toaster />
              </ScheduledNotificationProvider>
            </NotificationProvider>
          </TaskProvider>
        </QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
