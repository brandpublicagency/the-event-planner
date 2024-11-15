import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthQuote } from "@/components/auth/AuthQuote";
import { AuthForm } from "@/components/auth/AuthForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="grid grid-cols-1 min-h-screen md:grid-cols-2">
      <AuthQuote />
      <AuthForm />
    </div>
  );
};

export default Login;