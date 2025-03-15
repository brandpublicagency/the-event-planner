import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Tasks from './pages/Tasks';
import Contacts from './pages/Contacts';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import EventDetails from './pages/EventDetails';
import TaskDetails from './pages/TaskDetails';
import Notifications from './pages/Notifications';
import { NotificationProvider } from './contexts/NotificationContext';
import { ScheduledNotificationProvider } from './contexts/ScheduledNotificationContext';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/events/:eventCode",
    element: <EventDetails />,
  },
  {
    path: "/tasks",
    element: <Tasks />,
  },
  {
    path: "/tasks/:taskId",
    element: <TaskDetails />,
  },
  {
    path: "/contacts",
    element: <Contacts />,
  },
  {
    path: "/documents",
    element: <Documents />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  }
]);

// Wrap the application with our providers
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <ScheduledNotificationProvider>
            <RouterProvider router={router} />
          </ScheduledNotificationProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
