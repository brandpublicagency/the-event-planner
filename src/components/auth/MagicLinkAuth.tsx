import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MagicLinkAuthProps {
  supabaseClient: SupabaseClient;
  defaultEmail?: string;
  redirectTo: string;
}

export const MagicLinkAuth = ({ supabaseClient, defaultEmail, redirectTo }: MagicLinkAuthProps) => {
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
      redirectTo={formattedRedirectTo}
      {...(defaultEmail ? { defaultEmail } : {})}
      localization={{
        variables: {
          magic_link: {
            button_label: 'Send Magic Link',
            loading_button_label: 'Sending Magic Link...',
            confirmation_text: 'Check your email for the magic link',
            email_input_placeholder: 'youremail@warmkaroo.com',
            email_input_label: 'Email address'
          }
        }
      }}
    />
  );
};