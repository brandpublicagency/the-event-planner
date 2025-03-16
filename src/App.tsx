
import React from 'react';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from './routes/AppRoutes';
import { TaskProvider } from './contexts/TaskContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ScheduledNotificationProvider } from './contexts/ScheduledNotificationContext';

const queryClient = new QueryClient();

// Wrap the application with our providers in the correct order
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TaskProvider>
          <NotificationProvider>
            <ScheduledNotificationProvider>
              <AppRoutes />
              <Toaster />
            </ScheduledNotificationProvider>
          </NotificationProvider>
        </TaskProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
