
interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

const ChatMessage = ({ text, isUser }: ChatMessageProps) => {
  return (
    <div 
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 mr-2">
          <Sparkles size={12} />
        </div>
      )}
      
      <div
        className={cn(
          "px-4 py-3 max-w-[85%]",
          isUser 
            ? "bg-gray-800 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
            : "bg-gray-50 border border-gray-100 text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg"
        )}
      >
        {isUser ? (
          <div className="text-sm">{text}</div>
        ) : (
          <div className="markdown-content text-sm">
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
                code: ({ node, ...props }) => <code className="px-1 py-0.5 bg-gray-200 rounded text-sm" {...props} />,
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
        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white shrink-0 ml-2">
          <User size={12} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
