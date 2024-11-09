import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Dark section */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-2 text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">Event Planner</span>
          </div>
        </div>
        <div className="text-white">
          <blockquote className="text-2xl font-light mb-4">
            "You can always amend a big plan, but you can never expand a little one. I don't believe in little plans. I believe in plans big enough to meet a situation which we can't possibly foresee now." – Harry S. Truman
          </blockquote>
          <p className="text-zinc-400">Sarah Johnson</p>
        </div>
      </div>

      {/* Right side - Light section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-zinc-600 mb-8">Please enter your details to sign in</p>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  borderRadius: '6px',
                  backgroundColor: '#18181B',
                  color: 'white',
                  border: 'none',
                },
                input: {
                  borderRadius: '6px',
                  border: '1px solid #E4E4E7',
                  backgroundColor: 'white',
                },
                anchor: {
                  color: '#18181B',
                  textDecoration: 'none',
                },
              },
              className: {
                container: 'w-full',
                button: '!bg-primary hover:!bg-primary/90 transition-colors',
                input: 'focus:border-primary focus:ring-primary',
              },
            }}
            theme="custom"
            providers={[]}
            redirectTo={`${window.location.origin}/`}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;