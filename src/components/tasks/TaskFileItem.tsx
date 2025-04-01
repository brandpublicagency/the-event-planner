
import { FileText, Image } from "lucide-react";
import { FileActions } from "./file-actions/FileActions";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface TaskFile {
  id: string;
  task_id: string;
  file_name: string;
  file_path: string;
  content_type: string;
}

interface TaskFileItemProps {
  file: TaskFile;
}

export const TaskFileItem = ({ file }: TaskFileItemProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const isImage = file.content_type.startsWith('image/');

  useEffect(() => {
    if (isImage) {
      const { data } = supabase.storage
        .from("taskmanager-files")
        .getPublicUrl(file.file_path);
      
      if (data?.publicUrl) {
        setThumbnailUrl(data.publicUrl);
      }
    }
  }, [file.file_path, isImage]);

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
      <div className="flex items-center gap-2 min-w-0 max-w-[70%]">
        {isImage && thumbnailUrl ? (
          <div className="h-10 w-10 rounded overflow-hidden shrink-0 bg-muted flex items-center justify-center">
            <img 
              src={thumbnailUrl} 
              alt={file.file_name} 
              className="h-full w-full object-cover"
              onError={() => {
                console.error("Failed to load thumbnail");
                setThumbnailUrl(null);
              }} 
            />
          </div>
        ) : (
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="text-sm font-medium truncate" title={file.file_name}>
          {file.file_name}
        </span>
      </div>
      <FileActions file={file} />
    </div>
  );
};
