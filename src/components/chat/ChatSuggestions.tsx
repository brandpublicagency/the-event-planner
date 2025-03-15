
import { Sparkles } from "lucide-react";

interface ChatSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const ChatSuggestions = ({ suggestions, onSuggestionClick }: ChatSuggestionsProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Sparkles className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">
        Ask me anything about your events, tasks, contacts, or documents. I have full access to all information and can make changes for you.
      </p>
      <div className="w-full">
        <p className="text-xs text-gray-400 mb-3">Try asking</p>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="text-sm p-2 bg-gray-50 rounded-lg text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSuggestions;
