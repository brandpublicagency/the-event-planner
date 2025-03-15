
interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

const ChatMessage = ({ text, isUser }: ChatMessageProps) => {
  return (
    <div 
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shrink-0 mr-2">
          <Bot size={15} />
        </div>
      )}
      
      <div
        className={cn(
          "px-4 py-3 max-w-[85%] shadow-sm",
          isUser 
            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-xl rounded-bl-xl rounded-br-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-t-xl rounded-br-xl rounded-bl-sm"
        )}
      >
        {isUser ? (
          <div>{text}</div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-1" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
                code: ({ node, ...props }) => <code className="px-1 py-0.5 bg-gray-100 rounded text-sm" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="pl-3 border-l-2 border-gray-300 text-gray-600 italic my-2" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-2 border-gray-200" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                table: ({ node, ...props }) => <table className="min-w-full border-collapse my-2" {...props} />,
                thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
                tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200" {...props} />,
                tr: ({ node, ...props }) => <tr className="border-b border-gray-200" {...props} />,
                th: ({ node, ...props }) => <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
                td: ({ node, ...props }) => <td className="px-2 py-1 text-sm" {...props} />
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0 ml-2">
          <User size={15} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
