
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
        <Avatar className="h-6 w-6">
          <AvatarImage src="/bot-avatar.png" />
          <AvatarFallback className="bg-gray-50">
            <Bot className="h-3 w-3 text-gray-500" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[85%] px-3 py-1.5 rounded-lg text-xs ${
          isUser
            ? "bg-blue-50 text-gray-800"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <ChatMessageContent text={text} />
      </div>
      
      {isUser && (
        <Avatar className="h-6 w-6">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {isUser ? "U" : "A"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
