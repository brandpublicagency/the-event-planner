
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication in ProtectedRoute");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          setIsAuthenticated(false);
          return;
        }
        
        if (!session) {
          console.log("No active session found in ProtectedRoute");
          setIsAuthenticated(false);
        } else {
          console.log("Session found in ProtectedRoute, user is authenticated:", session.user.id);
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in ProtectedRoute:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("User is no longer authenticated");
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("User is authenticated:", session.user.id);
        setIsAuthenticated(true);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname]);

  // For development purposes, bypass authentication check
  // IMPORTANT: This is only for development and should be removed in production
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // For development purposes, allow access regardless of authentication status
  // Remove or uncomment the next line for proper authentication
  // return <>{children}</>;
  
  if (!isAuthenticated) {
    // Redirect to login with the intended destination
    console.log("User is not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("User is authenticated, rendering protected content");
  return <>{children}</>;
};
