import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal } from "@supabase/auth-ui-shared";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get the current site URL for redirection
  const siteUrl = window.location.origin;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
              Sign in to your account
            </h1>
            <p className="text-sm text-zinc-500">
              Enter your email and password to sign in
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeMinimal,
              extend: true,
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
                container: 'w-full [&>form>div]:space-y-[15px] [&>form>button]:mt-10',
                button: 'w-full bg-zinc-900 text-white hover:bg-zinc-800 text-left',
                input: 'w-full',
                label: 'hidden',
                divider: 'my-6',
                anchor: 'text-zinc-900 hover:text-zinc-800 text-left block',
                message: 'text-left',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: '',
                  password_label: '',
                  email_input_placeholder: 'Email address',
                  password_input_placeholder: 'Password',
                },
                sign_up: {
                  email_label: '',
                  password_label: '',
                  email_input_placeholder: 'Email address',
                  password_input_placeholder: 'Password',
                }
              }
            }}
            providers={[]}
            redirectTo={siteUrl}
            magicLink={false}
            showLinks={true}
          />

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