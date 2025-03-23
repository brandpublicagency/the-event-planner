
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useDocumentAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          setIsAuthenticated(false);
          return;
        }
        
        if (!session) {
          console.log("No active session found");
          toast({
            title: "Authentication required",
            description: "Please sign in to access documents",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        
        console.log("Session found, user is authenticated");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (!session) {
        console.log("Session ended, user no longer authenticated");
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        console.log("Session started/updated, user is authenticated");
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { isAuthenticated, isLoading };
}
