import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { RootLayout } from "@/layouts/RootLayout";
import Index from "@/pages/Index";
import Events from "@/pages/Events";
import PassedEvents from "@/pages/PassedEvents";
import Calendar from "@/pages/Calendar";
import NewEvent from "@/pages/NewEvent";
import EditEvent from "@/pages/EditEvent";
import EventDetails from "@/pages/EventDetails";
import Tasks from "@/pages/Tasks";
import TaskDetails from "@/pages/TaskDetails";
import Login from "@/pages/Login";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

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

export const AppRoutes = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to="/" replace /> : <Login />}
      />
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
      <Route
        path="/tasks/:id"
        element={
          <PrivateRoute>
            <RootLayout>
              <TaskDetails />
            </RootLayout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};