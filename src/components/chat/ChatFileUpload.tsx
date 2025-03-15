
import { useState } from "react";
import { Paperclip, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface ChatFileUploadProps {
  onFileUploaded: (fileUrl: string, fileName: string) => void;
}

export function ChatFileUpload({ onFileUploaded }: ChatFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleClearFile = () => {
    setSelectedFile(null);
    setProgress(0);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setProgress(0);
    
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `chat-files/${fileName}`;
    
    try {
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(filePath, selectedFile, {
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percent);
          }
        });
      
      if (error) throw error;
      
      if (data) {
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('chat-files')
          .getPublicUrl(filePath);
        
        console.log('File uploaded:', publicUrlData);
        
        // Notify parent component that file has been uploaded
        onFileUploaded(publicUrlData.publicUrl, selectedFile.name);
        
        // Clear the file
        handleClearFile();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
              <label className="cursor-pointer">
                <Paperclip className="h-4 w-4 text-gray-500" />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
              </label>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Attach a file</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {selectedFile && (
        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-xs">
          <File className="h-3 w-3 text-gray-500" />
          <span className="max-w-[120px] truncate">{selectedFile.name}</span>
          
          {isUploading ? (
            <div className="w-16">
              <Progress value={progress} className="h-1" />
            </div>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 p-0" 
                onClick={handleClearFile}
              >
                <X className="h-3 w-3 text-gray-500" />
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="h-5 px-2 text-[10px]" 
                onClick={handleUpload}
              >
                Upload
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
