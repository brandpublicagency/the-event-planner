import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";

interface MagicLinkAuthProps {
  supabaseClient: SupabaseClient;
  defaultEmail?: string;
  redirectTo: string;
}

export const MagicLinkAuth = ({ supabaseClient, defaultEmail, redirectTo }: MagicLinkAuthProps) => {
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
      redirectTo={redirectTo}
      {...(defaultEmail ? { defaultEmail } : {})}
      localization={{
        variables: {
          magic_link: {
            button_label: 'Send Magic Link',
            loading_button_label: 'Sending Magic Link...',
            confirmation_text: 'Check your email for the magic link',
            email_input_placeholder: 'youremail@warmkaroo.com'
          }
        }
      }}
    />
  );
};