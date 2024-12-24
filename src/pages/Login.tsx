import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordAuth } from "@/components/auth/PasswordAuth";
import { MagicLinkAuth } from "@/components/auth/MagicLinkAuth";
import { ResetPasswordAuth } from "@/components/auth/ResetPasswordAuth";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const email = searchParams.get('email');
  const [view, setView] = useState<'sign_in' | 'magic_link' | 'forgotten_password'>('sign_in');
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    // Set up the redirect URL with the full origin
    const baseUrl = window.location.origin;
    setRedirectUrl(`${baseUrl}/`);

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Don't automatically redirect if we're in a password reset flow
          const type = searchParams.get('type');
          if (type === 'recovery') {
            await supabase.auth.signOut(); // Sign out to allow password reset
            return;
          }

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
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast.error('Error checking authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      if (event === 'SIGNED_IN' && session) {
        try {
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
        } catch (error) {
          console.error('Profile fetch error:', error);
          toast.error('Error loading profile');
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (event === 'PASSWORD_RECOVERY') {
        setView('forgotten_password');
        toast.info('Please set your new password');
      }
    });

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

        <Tabs defaultValue="sign_in" value={view} className="w-full" onValueChange={(value) => setView(value as 'sign_in' | 'magic_link' | 'forgotten_password')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sign_in">Password</TabsTrigger>
            <TabsTrigger value="magic_link">Magic Link</TabsTrigger>
            <TabsTrigger value="forgotten_password">Reset Password</TabsTrigger>
          </TabsList>
          <TabsContent value="sign_in">
            <PasswordAuth 
              supabaseClient={supabase}
              redirectTo={redirectUrl}
              defaultEmail={email}
            />
          </TabsContent>
          <TabsContent value="magic_link">
            <MagicLinkAuth 
              supabaseClient={supabase}
              redirectTo={redirectUrl}
              defaultEmail={email}
            />
          </TabsContent>
          <TabsContent value="forgotten_password">
            <ResetPasswordAuth 
              supabaseClient={supabase}
              redirectTo={redirectUrl}
              defaultEmail={email}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;