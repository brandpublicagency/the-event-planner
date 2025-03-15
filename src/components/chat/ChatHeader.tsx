
import { Bot, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatHeaderProps {
  hasData: boolean;
  isMinimized?: boolean;
}

const ChatHeader = ({ hasData, isMinimized = false }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-100">
      <div className="flex items-center">
        <Bot className={`${isMinimized ? 'h-4 w-4' : 'h-5 w-5'} text-gray-500 mr-2`} />
        <h3 className={`${isMinimized ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
          Event Assistant
        </h3>
      </div>
      
      {hasData && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Full Access
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-[200px]">
                This assistant has full access to all events, contacts, tasks, and documents data.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default ChatHeader;
