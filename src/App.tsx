import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { TaskProvider } from "@/contexts/TaskContext";
import Sidebar from "./components/Sidebar";
import Index from "./pages/Index";
import Events from "./pages/Events";
import PassedEvents from "./pages/PassedEvents";
import Calendar from "./pages/Calendar";
import NewEvent from "./pages/NewEvent";
import EditEvent from "./pages/EditEvent";
import EventDetails from "./pages/EventDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Login from "./pages/Login";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppRoutes } from "./routes/AppRoutes";
import { AppProviders } from "./providers/AppProviders";
import { RootLayout } from "./layouts/RootLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </QueryClientProvider>
  );
};

export default App;