
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import ChatMessageContent from "./ChatMessageContent";

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  avatarUrl?: string;
}

const ChatMessage = ({ text, isUser, avatarUrl }: ChatMessageProps) => {
  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/bot-avatar.png" />
          <AvatarFallback className="bg-primary-foreground">
            <Bot className="h-4 w-4 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[85%] px-4 py-2 rounded-lg ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <ChatMessageContent text={text} />
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-primary">
            {isUser ? "U" : "A"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
