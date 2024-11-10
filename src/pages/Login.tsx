import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex dark:border-r">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img 
            src="https://www.warmkaroo.com/wp-content/uploads/2023/10/WKW.svg" 
            alt="WarmKaroo Logo" 
            className="h-[100px]"
          />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              You can always amend a big plan, but you can never expand a little one. I don't believe in little plans. I believe in planes big enough to meet a situation which we can't possibly foresee now.
            </p>
            <footer className="text-sm">Harry S. Truman</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          <div className="grid gap-6">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#18181B',
                      brandAccent: '#27272A',
                    },
                  },
                },
                style: {
                  container: {
                    textAlign: 'left',
                  },
                  button: {
                    width: '100%',
                    borderRadius: '0.375rem',
                  },
                  input: {
                    borderRadius: '0.375rem',
                  },
                  label: {
                    textAlign: 'left',
                  },
                  anchor: {
                    textAlign: 'left',
                  },
                  message: {
                    textAlign: 'left',
                  },
                },
              }}
              theme="light"
              providers={[]}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;