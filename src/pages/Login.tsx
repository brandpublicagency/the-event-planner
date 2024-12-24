import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user);
        toast.success('Successfully signed in!');
        navigate('/');
      }
    });

    // Check if we have an error message in the URL
    const errorMessage = searchParams.get('error_description');
    if (errorMessage) {
      setAuthError(decodeURIComponent(errorMessage));
      toast.error(decodeURIComponent(errorMessage));
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {email ? 'Accept Team Invitation' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {email ? 'Create your account to join the team' : 'Sign in with your email'}
          </p>
          {authError && (
            <p className="mt-2 text-sm text-red-600">
              {authError}
            </p>
          )}
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#666666',
                }
              }
            }
          }}
          theme="light"
          providers={[]}
          redirectTo={`${window.location.origin}/`}
          {...(email ? { defaultEmail: email } : {})}
          view="magic_link"
          showLinks={false}
          localization={{
            variables: {
              magic_link: {
                email_input_label: 'Email address',
                email_input_placeholder: 'Your email address',
                button_label: 'Send Magic Link',
                loading_button_label: 'Sending Magic Link...',
                confirmation_text: 'Check your email for the magic link',
              }
            }
          }}
        />
      </Card>
    </div>
  );
};

export default Login;