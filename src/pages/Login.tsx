
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MagicLinkAuth } from "@/components/auth/MagicLinkAuth";
import { PasswordAuth } from "@/components/auth/PasswordAuth";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const email = searchParams.get('email');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
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
      } else if (event === 'USER_UPDATED') {
        toast.success('Authentication successful');
      }
    });

    // Check for error messages in URL params
    const errorMessage = searchParams.get('error_description');
    if (errorMessage) {
      const decodedError = decodeURIComponent(errorMessage);
      setAuthError(decodedError);
      toast.error(decodedError);
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
          {authError && (
            <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm">
              {authError}
            </div>
          )}
        </div>

        <Tabs defaultValue="magic-link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="magic-link">
            <MagicLinkAuth 
              supabaseClient={supabase}
              defaultEmail={email}
            />
          </TabsContent>
          <TabsContent value="password">
            <PasswordAuth 
              supabaseClient={supabase}
              defaultEmail={email}
              redirectTo={window.location.origin}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
