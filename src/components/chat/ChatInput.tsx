
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { ChatFileUpload } from "./ChatFileUpload";
import { useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  placeholderText?: string;
}

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholderText = "Type your message..."
}: ChatInputProps) => {
  const [attachedFiles, setAttachedFiles] = useState<{url: string, name: string}[]>([]);
  
  const handleFileUploaded = (fileUrl: string, fileName: string) => {
    setAttachedFiles(prev => [...prev, {url: fileUrl, name: fileName}]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If there are attached files, modify the message to include file links
    if (attachedFiles.length > 0) {
      const fileLinks = attachedFiles.map(file => 
        `[${file.name}](${file.url})`
      ).join('\n');
      
      // Add file links to message if not empty or append to message
      const messageWithFiles = value.trim() 
        ? `${value}\n\nAttached files:\n${fileLinks}`
        : `I'm sending you these files:\n${fileLinks}`;
      
      // Temporarily update the input value with files
      const originalValue = value;
      (e.target as any).elements[0].value = messageWithFiles;
      
      // Submit the form
      await onSubmit(e);
      
      // Reset the input value
      (e.target as any).elements[0].value = originalValue;
      
      // Clear attached files
      setAttachedFiles([]);
    } else {
      // Normal submission without files
      await onSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-3 border-t flex items-center gap-2">
      {attachedFiles.length > 0 && (
        <div className="absolute -top-10 left-0 right-0 bg-gray-50 p-2 text-xs border-t flex gap-2 items-center flex-wrap">
          {attachedFiles.map((file, index) => (
            <div key={index} className="bg-white px-2 py-1 rounded border flex items-center gap-1">
              <span className="truncate max-w-[150px]">{file.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0"
                onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
              >
                <span className="sr-only">Remove</span>
                <span aria-hidden>×</span>
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex-1 flex items-center relative">
        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholderText}
          className="pr-10"
          disabled={isLoading}
        />
        <div className="absolute right-2">
          <ChatFileUpload onFileUploaded={handleFileUploaded} />
        </div>
      </div>
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || (!value.trim() && attachedFiles.length === 0)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default ChatInput;
