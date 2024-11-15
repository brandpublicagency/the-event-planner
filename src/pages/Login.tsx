import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal } from "@supabase/auth-ui-shared";
import { useToast } from "@/components/ui/use-toast";
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
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left section with branding */}
      <div className="relative hidden md:flex flex-col bg-zinc-900 text-white p-12">
        <div className="flex items-start">
          <img
            src="https://www.brandpublic.agency/wp-content/uploads/2024/11/WK-Light-Logo.svg"
            alt="Logo"
            className="h-[90px]"
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">Welcome to Event Manager</h1>
            <p className="text-xl text-zinc-400">
              Streamline your event planning process with our comprehensive management solution.
            </p>
          </div>
        </div>
      </div>

      {/* Right section with auth form */}
      <div className="flex flex-col justify-center p-8">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center md:text-left">
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
                button: 'w-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors duration-200',
                input: 'w-full',
                label: 'text-sm font-medium text-zinc-900 block',
                divider: 'my-6',
                anchor: 'text-zinc-900 hover:text-zinc-800 font-medium',
                message: 'text-sm',
              },
            }}
            providers={[]}
            magicLink={true}
            redirectTo={window.location.origin}
            showLinks={true}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: "Already have an account? Sign in",
                },
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Create a password',
                  button_label: 'Create account',
                  loading_button_label: 'Creating account...',
                  social_provider_text: 'Sign up with {{provider}}',
                  link_text: "Don't have an account? Sign up",
                },
                magic_link: {
                  email_input_label: 'Email address',
                  button_label: 'Send magic link',
                  loading_button_label: 'Sending magic link...',
                  link_text: 'Send a magic link email',
                },
                forgotten_password: {
                  email_label: 'Email address',
                  password_label: 'New password',
                  button_label: 'Send reset instructions',
                  loading_button_label: 'Sending reset instructions...',
                  link_text: 'Forgot your password?',
                },
              },
            }}
          />

          <div className="text-center text-sm text-zinc-500">
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
    </div>
  );
};

export default Login;