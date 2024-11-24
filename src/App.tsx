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
import Login from "./pages/Login";
import { ScrollArea } from "@/components/ui/scroll-area";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[80px]" : "w-64"
        } bg-white shadow-sm`}
      >
        <ScrollArea className="h-full">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </ScrollArea>
      </div>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <TooltipProvider>
          <TaskProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={
                  session ? <Navigate to="/" replace /> : <Login />
                } />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <Index />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <Events />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/passed-events"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <PassedEvents />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/events/new"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <NewEvent />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/events/:id"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <EventDetails />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/events/:id/edit"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <EditEvent />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <Calendar />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tasks"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <Tasks />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TaskProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;