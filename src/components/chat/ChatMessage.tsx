
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
        <Avatar className="h-7 w-7">
          <AvatarImage src="/bot-avatar.png" />
          <AvatarFallback className="bg-gray-50">
            <Bot className="h-3.5 w-3.5 text-gray-500" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[85%] px-3.5 py-2 rounded-lg text-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <ChatMessageContent text={text} />
      </div>
      
      {isUser && (
        <Avatar className="h-7 w-7">
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
