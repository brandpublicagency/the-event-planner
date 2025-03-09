
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MagicLinkAuthProps {
  supabaseClient: SupabaseClient;
  defaultEmail?: string;
}

export const MagicLinkAuth = ({ supabaseClient, defaultEmail }: MagicLinkAuthProps) => {
  const [redirectTo, setRedirectTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(defaultEmail || "");

  useEffect(() => {
    // Use the current window location as the redirect URL
    const currentOrigin = window.location.origin;
    setRedirectTo(currentOrigin);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!email.endsWith('@warmkaroo.com')) {
      toast.error('Only @warmkaroo.com email addresses are allowed');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      
      if (error) {
        if (error.message.includes('rate_limit')) {
          toast.error('Please wait a moment before requesting another magic link');
        } else if (error.message.includes('Database error')) {
          toast.error('Authentication error. Please contact your administrator.');
          console.error('Auth error:', error);
        } else {
          toast.error(`Error sending magic link: ${error.message}`);
          console.error('Auth error:', error);
        }
      } else {
        toast.success('Check your email for the magic link');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Error sending magic link. Please try again.');
    } finally {
      setIsSubmitting(false);
      // Add a delay before allowing another submission
      setTimeout(() => setIsSubmitting(false), 15000); // 15 seconds delay
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="youremail@warmkaroo.com"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-black hover:bg-gray-800 text-white rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Sending Magic Link...' : 'Send Magic Link'}
        </button>
      </form>
      <p className="text-sm text-center text-gray-500">
        {isSubmitting ? 'Processing...' : 'Check your email for the magic link after submitting'}
      </p>
    </div>
  );
};
