
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  placeholderText?: string;
}

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholderText = "Type your message..."
}: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="p-3 border-t flex items-center gap-2">
      <div className="flex-1">
        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholderText}
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !value.trim()}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default ChatInput;
