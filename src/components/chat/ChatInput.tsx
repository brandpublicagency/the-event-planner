
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { FormEvent, ChangeEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
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
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    await onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t flex items-center gap-2">
      <div className="flex-1">
        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholderText}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (value.trim() && !isLoading) {
                handleSubmit(e as unknown as FormEvent);
              }
            }
          }}
        />
      </div>
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !value.trim()}
        onClick={handleSubmit}
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
