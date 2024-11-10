import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";

const Login = () => {
  const supabaseClient = useSupabaseClient();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Auth
          supabaseClient={supabaseClient}
          appearance={{
            theme: ThemeSupa,
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
