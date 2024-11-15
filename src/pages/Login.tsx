import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal } from "@supabase/auth-ui-shared";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

  const handleMagicLink = async () => {
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const email = emailInput?.value?.trim();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;

      toast({
        title: "Magic link sent",
        description: "Check your email for the login link",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 min-h-screen md:grid-cols-2">
      {/* Dark section with quote */}
      <div className="relative hidden md:flex flex-col bg-zinc-900 text-white p-12">
        <div className="flex items-start">
          <img
            src="https://www.brandpublic.agency/wp-content/uploads/2024/11/WK-Light-Logo.svg"
            alt="Logo"
            className="h-[90px]"
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="mt-auto">
            <blockquote className="space-y-3">
              <p className="text-2xl font-light leading-relaxed">
                "You can always amend a big plan, but you can never expand a little one. I don't believe in little plans. I believe in planes big enough to meet a situation which we can't possibly foresee now."
              </p>
              <footer className="text-lg text-zinc-400">Harry S. Truman</footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Light section with auth form */}
      <div className="flex flex-col justify-center p-8">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500">
              Sign in to your account or create a new one
            </p>
          </div>

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
                container: 'w-full space-y-6',
                button: 'w-full bg-zinc-900 text-white hover:bg-zinc-800 text-left',
                input: 'w-full',
                label: 'text-sm font-medium text-zinc-900 block text-left',
                divider: 'my-6',
                anchor: 'text-zinc-900 hover:text-zinc-800 text-left block',
                message: 'text-left',
              },
            }}
            providers={[]}
            magicLink={true}
            redirectTo={window.location.origin}
            showLinks={false}
          />

          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1 text-sm"
              onClick={handleMagicLink}
            >
              Magic link
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-sm"
              onClick={() => window.location.href = '#auth-forgot-password'}
            >
              Forgot?
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-sm"
              onClick={() => window.location.href = '#auth-sign-up'}
            >
              Sign up
            </Button>
          </div>

          <div className="text-left text-sm text-zinc-500">
            <p>
              By clicking continue, you agree to our{' '}
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
    </div>
  );
};

export default Login;