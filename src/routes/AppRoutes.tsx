import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Routes,
  BrowserRouter,
  Navigate
} from "react-router-dom"
import { Home } from "@/pages/Home"
import Login from "@/pages/Login"
import Events from "@/pages/Events";
import NewEvent from "@/pages/NewEvent";
import EventDetails from "@/pages/EventDetails";
import Documents from "@/pages/Documents";
import { useSession } from "@/integrations/supabase/authProvider";
import BookingForm from "@/pages/BookingForm";

const AppRoutes = () => {
  const { session, isLoading } = useSession();

  // If the session is still loading, you might want to render a loading indicator
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Define a simple component for the protected route
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session && !isLoading) {
      // Redirect to the login page if not authenticated
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  return (
    <Routes>
      {/* Public routes that don't require authentication */}
      <Route path="/booking" element={<BookingForm />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes requiring authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/new" element={<NewEvent />} />
        <Route path="/events/:eventCode" element={<EventDetails />} />
        <Route path="/documents" element={<Documents />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
