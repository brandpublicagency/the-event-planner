import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";

interface ResetPasswordAuthProps {
  supabaseClient: SupabaseClient;
  defaultEmail?: string;
  redirectTo: string;
}

export const ResetPasswordAuth = ({ supabaseClient, defaultEmail, redirectTo }: ResetPasswordAuthProps) => {
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
      redirectTo={redirectTo}
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