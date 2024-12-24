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
  const [isLoading, setIsLoading] = useState(true);
  const email = searchParams.get('email');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if it's a first-time login by checking profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, mobile')
          .eq('id', session.user.id)
          .single();

        if (!profile?.full_name) {
          // First time login - redirect to profile settings
          navigate('/profile-settings');
          toast.info('Please complete your profile information');
        } else {
          // Regular login - redirect to home
          navigate('/');
        }
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      if (event === 'SIGNED_IN') {
        // Check if it's a first-time login
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, mobile')
          .eq('id', session.user.id)
          .single();

        if (!profile?.full_name) {
          navigate('/profile-settings');
          toast.info('Please complete your profile information');
        } else {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    // Check for error messages in URL
    const errorMessage = searchParams.get('error_description');
    if (errorMessage) {
      toast.error(decodeURIComponent(errorMessage));
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {email ? 'Accept Team Invitation' : 'Welcome to Warm Karoo'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {email 
              ? 'Create your account to join the team' 
              : 'Sign in with your @warmkaroo.com email'}
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          view="magic_link"
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
          showLinks={false}
          providers={[]}
          redirectTo={`${window.location.origin}/`}
          {...(email ? { defaultEmail: email } : {})}
          localization={{
            variables: {
              magic_link: {
                button_label: 'Send Magic Link',
                loading_button_label: 'Sending Magic Link...',
                confirmation_text: 'Check your email for the magic link',
                email_input_placeholder: 'your.name@warmkaroo.com'
              }
            }
          }}
        />
      </Card>
    </div>
  );
};

export default Login;