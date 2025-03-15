
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ChatInput = ({ value, onChange, onSubmit, isLoading }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="p-3 border-t border-gray-100 bg-white">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={onChange}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50 rounded-lg focus-visible:ring-gray-400 focus-visible:ring-offset-0 border-gray-100"
          autoComplete="off"
          disabled={isLoading}
        />
        <Button 
          type="submit"
          size="icon"
          className="bg-gray-100 hover:bg-gray-200 rounded-lg w-10 h-10 shrink-0 text-gray-600 transition-colors duration-200"
          disabled={isLoading}
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
