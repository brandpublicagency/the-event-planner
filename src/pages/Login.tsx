import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal } from "@supabase/auth-ui-shared";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-6">
          <img
            src="https://www.brandpublic.agency/wp-content/uploads/2024/11/WK-Light-Logo.svg"
            alt="Logo"
            className="mx-auto h-12"
          />
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
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
                },
              },
            },
          }}
          providers={[]}
          additionalData={{
            full_name: true,
            surname: true,
            mobile: true,
          }}
        />
      </div>
    </div>
  );
};

export default Login;