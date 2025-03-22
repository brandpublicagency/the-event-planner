
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface ResetPasswordAuthProps {
  supabaseClient: SupabaseClient;
  defaultEmail?: string;
  redirectTo: string;
}

export const ResetPasswordAuth = ({ supabaseClient, defaultEmail, redirectTo }: ResetPasswordAuthProps) => {
  const [formattedRedirectTo, setFormattedRedirectTo] = useState(redirectTo);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setErrorMessage('Invalid redirect URL configuration');
        // Fallback to the current origin
        return window.location.origin;
      }
    };

    setFormattedRedirectTo(formatUrl(redirectTo));
  }, [redirectTo]);

  return (
    <div>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {errorMessage}
        </div>
      )}
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
    </div>
  );
};
