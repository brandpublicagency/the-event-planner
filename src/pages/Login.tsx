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
  const [view, setView] = useState<'sign_in' | 'sign_up' | 'update_password'>(
    email ? 'sign_up' : 'sign_in'
  );

  useEffect(() => {
    // Check for authentication errors
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'PASSWORD_RECOVERY') {
        setView('update_password');
        toast.info('Please set your new password');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user);
        // Only redirect if not in password recovery mode
        if (view !== 'update_password') {
          navigate('/');
        }
      } else if (event === 'USER_UPDATED') {
        toast.success('Your password has been updated successfully');
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
  }, [navigate, searchParams, view]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {view === 'update_password' 
              ? 'Update Your Password'
              : email 
                ? 'Accept Team Invitation' 
                : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {view === 'update_password'
              ? 'Please enter your new password'
              : email 
                ? 'Create your account to join the team'
                : 'Sign in to your account'}
          </p>
          {authError && (
            <p className="mt-2 text-sm text-red-600">
              {authError}
            </p>
          )}
        </div>

        <Auth
          supabaseClient={supabase}
          view={view}
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
          showLinks={true}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
              },
              forgotten_password: {
                email_label: 'Email address',
                button_label: 'Send reset instructions',
              },
              update_password: {
                password_label: 'New password',
                button_label: 'Update password',
              }
            }
          }}
        />
      </Card>
    </div>
  );
};

export default Login;