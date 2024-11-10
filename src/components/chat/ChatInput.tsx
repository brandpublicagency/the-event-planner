import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ChatInput = ({ value, onChange, onSubmit, isLoading }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t border-gray-100">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={onChange}
          placeholder="Type your message..."
          className="flex-1 rounded-3xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          autoComplete="off"
          disabled={isLoading}
        />
        <Button 
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity rounded-3xl px-6 text-white hover:text-white"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;