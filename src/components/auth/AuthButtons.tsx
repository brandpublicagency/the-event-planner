import { Button } from "@/components/ui/button";

interface AuthButtonsProps {
  onMagicLink: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export const AuthButtons = ({ onMagicLink, onForgotPassword, onSignUp }: AuthButtonsProps) => (
  <div className="flex gap-2 w-full">
    <Button 
      variant="outline" 
      className="flex-1 text-sm bg-transparent rounded-[4px]"
      onClick={onMagicLink}
    >
      Magic link
    </Button>
    <Button 
      variant="outline" 
      className="flex-1 text-sm bg-transparent rounded-[4px]"
      onClick={onForgotPassword}
    >
      Forgot?
    </Button>
    <Button 
      variant="outline" 
      className="flex-1 text-sm bg-transparent rounded-[4px]"
      onClick={onSignUp}
    >
      Sign up
    </Button>
  </div>
);