
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2 } from "lucide-react";
import { KeyboardEvent, useState, useEffect } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
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
  const [isComposing, setIsComposing] = useState(false);
  
  // Handle Enter key press to submit the form
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Prevent form submission while IME composition is in progress (for languages like Chinese, Japanese)
    if (isComposing) return;
    
    // Submit on Enter if not empty
    if (e.key === "Enter" && !e.shiftKey && value.trim() !== "" && !isLoading) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  };
  
  // Focus the input field on component mount
  useEffect(() => {
    const inputElement = document.querySelector('input[placeholder="' + placeholderText + '"]') as HTMLInputElement;
    if (inputElement && !isLoading) {
      inputElement.focus();
    }
  }, [isLoading, placeholderText]);

  return (
    <form onSubmit={onSubmit} className="p-3 border-t border-gray-100 bg-white">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={placeholderText}
          className="flex-1 bg-gray-50 rounded-lg focus-visible:ring-gray-400 focus-visible:ring-offset-0 border-gray-100"
          autoComplete="off"
          disabled={isLoading}
        />
        <Button 
          type="submit"
          size="icon"
          className={`rounded-lg w-10 h-10 shrink-0 transition-colors duration-200 ${
            value.trim() === "" || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
          disabled={value.trim() === "" || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
