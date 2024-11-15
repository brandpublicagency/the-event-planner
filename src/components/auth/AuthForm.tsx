import React from 'react';
import { Auth } from "@supabase/auth-ui-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthButtons } from "./AuthButtons";
import { authAppearance, authLocalization } from "./AuthConfig";

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

  const handleSignUp = () => {
    const container = document.querySelector('.supabase-auth-ui_ui-container');
    const signUpButton = container?.querySelector('button[type="submit"]');
    if (signUpButton instanceof HTMLElement) {
      signUpButton.click();
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
          appearance={authAppearance}
          localization={authLocalization}
          providers={[]}
          view="sign_in"
          showLinks={false}
          redirectTo={window.location.origin}
        />

        <AuthButtons
          onMagicLink={handleMagicLink}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSignUp}
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
  );
};