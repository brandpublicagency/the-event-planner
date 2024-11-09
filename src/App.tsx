import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "./components/Sidebar";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import NewClient from "./pages/NewClient";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import Tasks from "./pages/Tasks";
import NewTask from "./pages/NewTask";
import Documents from "./pages/Documents";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen">
                  <Sidebar />
                  <div className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/clients/new" element={<NewClient />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/new" element={<NewProject />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/tasks/new" element={<NewTask />} />
                      <Route path="/documents" element={<Documents />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;