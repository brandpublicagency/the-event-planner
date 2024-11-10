import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal } from "@supabase/auth-ui-shared";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
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
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <img
            src="https://www.brandpublic.agency/wp-content/uploads/2024/11/WK-Light-Logo.svg"
            alt="Logo"
            className="h-[90px] mx-auto"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Choose your preferred sign in method below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeMinimal,
                variables: {
                  default: {
                    colors: {
                      brand: '#18181B',
                      brandAccent: '#27272A',
                      inputBackground: 'white',
                      inputBorder: '#E4E4E7',
                      inputBorderFocus: '#18181B',
                      inputBorderHover: '#71717A',
                      inputPlaceholder: '#A1A1AA',
                    },
                    space: {
                      inputPadding: '0.75rem',
                      buttonPadding: '0.75rem',
                    },
                    borderWidths: {
                      buttonBorderWidth: '1px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '0.5rem',
                      buttonBorderRadius: '0.5rem',
                      inputBorderRadius: '0.5rem',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full bg-zinc-900 text-white hover:bg-zinc-800',
                  input: 'w-full',
                  label: 'text-sm font-medium text-zinc-900',
                },
              }}
              providers={[]}
              view="sign_in"
              redirectTo={window.location.origin}
              magicLink={true}
            />
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-zinc-900">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-zinc-900">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;