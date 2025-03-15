
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppRoutes } from './routes/AppRoutes';
import { NotificationProvider } from './contexts/NotificationContext';
import { ScheduledNotificationProvider } from './contexts/ScheduledNotificationContext';

const queryClient = new QueryClient();

// Wrap the application with our providers
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <ScheduledNotificationProvider>
            <AppRoutes />
          </ScheduledNotificationProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
