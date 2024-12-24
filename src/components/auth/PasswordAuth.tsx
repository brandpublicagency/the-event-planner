import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";

interface PasswordAuthProps {
  supabaseClient: SupabaseClient;
  defaultEmail?: string;
  redirectTo: string;
}

export const PasswordAuth = ({ supabaseClient, defaultEmail, redirectTo }: PasswordAuthProps) => {
  return (
    <Auth
      supabaseClient={supabaseClient}
      view="sign_in"
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
          sign_in: {
            email_label: 'Email address',
            password_label: 'Password',
            email_input_placeholder: 'youremail@warmkaroo.com',
            button_label: 'Sign in',
            loading_button_label: 'Signing in...',
            social_provider_text: 'Sign in with {{provider}}',
            link_text: 'Already have an account? Sign in',
          },
          sign_up: {
            email_label: 'Email address',
            password_label: 'Create a password',
            email_input_placeholder: 'youremail@warmkaroo.com',
            button_label: 'Sign up',
            loading_button_label: 'Signing up...',
            social_provider_text: 'Sign up with {{provider}}',
            link_text: "Don't have an account? Sign up",
          },
        }
      }}
    />
  );
};