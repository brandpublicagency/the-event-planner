
import React from 'react';
import { FileText, Image, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessageContentProps {
  text: string;
}

const ChatMessageContent: React.FC<ChatMessageContentProps> = ({ text }) => {
  // Regular expression to find markdown links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  // Split the text into parts to render links and file previews
  const renderContent = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    // Create a copy of the text for regex operations
    const textCopy = text.toString();
    
    while ((match = linkRegex.exec(textCopy)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(textCopy.substring(lastIndex, match.index));
      }
      
      // Get the link text and URL
      const [fullMatch, linkText, linkUrl] = match;
      
      // Check if it's an image link
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(linkUrl);
      
      // Check if it's a PDF
      const isPdf = /\.pdf$/i.test(linkUrl);
      
      if (isImage) {
        // Render image preview
        parts.push(
          <div key={match.index} className="my-2">
            <p className="text-xs text-gray-500 mb-1">{linkText}</p>
            <div className="border rounded overflow-hidden max-w-[300px]">
              <img 
                src={linkUrl} 
                alt={linkText} 
                className="w-full h-auto max-h-[200px] object-contain"
              />
              <div className="bg-gray-50 p-2 flex justify-end">
                <a 
                  href={linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  Download
                </a>
              </div>
            </div>
          </div>
        );
      } else if (isPdf) {
        // Render PDF preview
        parts.push(
          <div key={match.index} className="my-2 border rounded p-3 bg-gray-50 max-w-[300px]">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">{linkText}</span>
            </div>
            <div className="mt-2 flex justify-end">
              <a 
                href={linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-500 flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                View PDF
              </a>
            </div>
          </div>
        );
      } else {
        // Render regular link
        parts.push(
          <a 
            key={match.index}
            href={linkUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {linkText}
          </a>
        );
      }
      
      lastIndex = match.index + fullMatch.length;
    }
    
    // Add remaining text
    if (lastIndex < textCopy.length) {
      parts.push(textCopy.substring(lastIndex));
    }
    
    return parts;
  };
  
  return (
    <div className="whitespace-pre-wrap break-words">
      {renderContent()}
    </div>
  );
};

export default ChatMessageContent;
