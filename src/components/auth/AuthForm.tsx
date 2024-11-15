import React from 'react';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal } from "@supabase/auth-ui-shared";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AuthForm = () => {
  const { toast } = useToast();

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

  const handleForgotPassword = async () => {
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset link",
        variant: "destructive",
      });
    }
  };

  return (
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
              label: 'hidden', // Hide the labels
              divider: 'my-6',
              anchor: 'hidden', // Hide the default auth links
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
                button_label: 'Sign in',
                link_text: '',
              },
              sign_up: {
                email_label: '',
                password_label: '',
                email_input_placeholder: 'Email address',
                password_input_placeholder: 'Password',
                button_label: 'Sign up',
                link_text: '',
              },
              forgotten_password: {
                link_text: '',
              },
            },
          }}
          providers={[]}
          view="sign_in"
          magicLink={false}
          redirectTo={window.location.origin}
        />

        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 text-sm bg-transparent rounded-[4px]"
            onClick={handleMagicLink}
          >
            Magic link
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 text-sm bg-transparent rounded-[4px]"
            onClick={handleForgotPassword}
          >
            Forgot?
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 text-sm bg-transparent rounded-[4px]"
            onClick={() => {
              const container = document.querySelector('.supabase-auth-ui_ui-container');
              const signUpButton = container?.querySelector('button[type="submit"]');
              if (signUpButton instanceof HTMLElement) {
                signUpButton.click();
              }
            }}
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
  );
};