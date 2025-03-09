
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Routes,
  BrowserRouter,
  Navigate,
  Outlet
} from "react-router-dom"
import Login from "@/pages/Login"
import Events from "@/pages/Events";
import NewEvent from "@/pages/NewEvent";
import EventDetails from "@/pages/EventDetails";
import Documents from "@/pages/Documents";
import BookingForm from "@/pages/BookingForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const AppRoutes = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // If the session is still loading, render a loading indicator
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Define a simple component for the protected route using Outlet instead
  const ProtectedRoute = () => {
    if (!session && !isLoading) {
      // Redirect to the login page if not authenticated
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  };

  return (
    <Routes>
      {/* Public routes that don't require authentication */}
      <Route path="/booking" element={<BookingForm />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes requiring authentication */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<Events />} /> {/* Using Events as home page for now */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/new" element={<NewEvent />} />
        <Route path="/events/:eventCode" element={<EventDetails />} />
        <Route path="/documents" element={<Documents />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
