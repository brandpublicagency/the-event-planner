
import { Info } from "lucide-react";

interface ChatErrorStateProps {
  onRetry: () => void;
}

const ChatErrorState = ({ onRetry }: ChatErrorStateProps) => {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
        <Info className="h-6 w-6 text-red-400" />
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Unable to load context data. The assistant may have limited information available.
      </p>
      <button 
        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        onClick={onRetry}
      >
        Retry Loading Data
      </button>
    </div>
  );
};

export default ChatErrorState;
