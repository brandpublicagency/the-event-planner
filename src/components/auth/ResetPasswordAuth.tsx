import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ResetPasswordAuthProps {
  supabaseClient: SupabaseClient;
  defaultEmail?: string;
  redirectTo: string;
}

export const ResetPasswordAuth = ({ supabaseClient, defaultEmail, redirectTo }: ResetPasswordAuthProps) => {
  const [formattedRedirectTo, setFormattedRedirectTo] = useState(redirectTo);

  useEffect(() => {
    // Ensure the redirect URL is properly encoded and includes the protocol
    const formatUrl = (url: string) => {
      try {
        // If URL is relative, prepend the current origin
        if (!url.startsWith('http')) {
          url = `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
        }
        const urlObject = new URL(url);
        return urlObject.toString();
      } catch (error) {
        console.error('Error formatting URL:', error);
        toast.error('Invalid redirect URL configuration');
        // Fallback to the current origin
        return window.location.origin;
      }
    };

    setFormattedRedirectTo(formatUrl(redirectTo));
  }, [redirectTo]);

  return (
    <Auth
      supabaseClient={supabaseClient}
      view="forgotten_password"
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
      redirectTo={formattedRedirectTo}
      {...(defaultEmail ? { defaultEmail } : {})}
      localization={{
        variables: {
          forgotten_password: {
            email_label: 'Email address',
            button_label: 'Send Reset Instructions',
            loading_button_label: 'Sending reset instructions...',
            confirmation_text: 'Check your email for the password reset link',
            email_input_placeholder: 'youremail@warmkaroo.com'
          }
        }
      }}
    />
  );
};