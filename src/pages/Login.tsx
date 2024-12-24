import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const email = searchParams.get('email');
  const [view, setView] = useState<'sign_in' | 'magic_link'>('sign_in');

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

        <Tabs defaultValue="sign_in" className="w-full" onValueChange={(value) => setView(value as 'sign_in' | 'magic_link')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign_in">Password</TabsTrigger>
            <TabsTrigger value="magic_link">Magic Link</TabsTrigger>
          </TabsList>
          <TabsContent value="sign_in">
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
              showLinks={false}
              providers={[]}
              redirectTo={`${window.location.origin}/`}
              {...(email ? { defaultEmail: email } : {})}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Email address',
                    password_label: 'Password',
                    email_input_placeholder: 'your.name@warmkaroo.com',
                    button_label: 'Sign in',
                    loading_button_label: 'Signing in...',
                    social_provider_text: 'Sign in with {{provider}}',
                    link_text: 'Already have an account? Sign in',
                  },
                  sign_up: {
                    email_label: 'Email address',
                    password_label: 'Create a password',
                    email_input_placeholder: 'your.name@warmkaroo.com',
                    button_label: 'Sign up',
                    loading_button_label: 'Signing up...',
                    social_provider_text: 'Sign up with {{provider}}',
                    link_text: 'Don\'t have an account? Sign up',
                  },
                }
              }}
            />
          </TabsContent>
          <TabsContent value="magic_link">
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
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;