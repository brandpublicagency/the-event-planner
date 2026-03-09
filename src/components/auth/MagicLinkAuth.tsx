
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface MagicLinkAuthProps {
  supabaseClient: SupabaseClient;
  defaultEmail?: string;
}

export const MagicLinkAuth = ({ supabaseClient, defaultEmail }: MagicLinkAuthProps) => {
  const [redirectTo, setRedirectTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(defaultEmail || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Use the current window location as the redirect URL
    const currentOrigin = window.location.origin;
    setRedirectTo(currentOrigin);
  }, []);

  // Clear error when email changes
  useEffect(() => {
    setErrorMessage(null);
  }, [email]);

  const validateEmail = (email: string): boolean => {
    if (!email || email.trim() === "") {
      setErrorMessage("Email is required");
      return false;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    // Check for warmkaroo.com domain
    if (!email.toLowerCase().endsWith('@warmkaroo.com')) {
      setErrorMessage("Only @warmkaroo.com email addresses are allowed");
      return false;
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Reset error and success states
    setErrorMessage(null);
    setSuccessMessage(null);
    
    // Validate email format
    if (!validateEmail(email)) {
      console.error(errorMessage || "Invalid email format");
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
        console.error('Auth error:', error);
        if (error.message.includes('rate_limit')) {
          setErrorMessage('Please wait a moment before requesting another magic link');
        } else if (error.message.includes('Database error') || error.message.includes('@warmkaroo.com')) {
          setErrorMessage('Authentication error. Ensure you are using a valid @warmkaroo.com email address.');
        } else {
          setErrorMessage(`Error sending magic link: ${error.message}`);
        }
      } else {
        setSuccessMessage('Check your email for the magic link');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage('Error sending magic link. Please try again.');
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
            className={`w-full px-3 py-2 border rounded-md ${errorMessage ? 'border-destructive' : 'border-border'}`}
            required
          />
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-sm text-green-500">{successMessage}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-foreground hover:bg-foreground/90 text-background rounded-md transition-colors disabled:opacity-50"
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
