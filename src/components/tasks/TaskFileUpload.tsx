import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskFileUploadProps {
  taskId: string;
  onSuccess?: () => void;
}

export function TaskFileUpload({ taskId, onSuccess }: TaskFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Starting file upload:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      try {
        setIsUploading(true);

        // Generate a unique file path
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const filePath = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        console.log('Generated file path:', filePath);

        // Upload file to storage with proper content type
        const { error: uploadError } = await supabase.storage
          .from("task-files")
          .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw uploadError;
        }

        console.log('File uploaded to storage successfully');

        // Create database record
        const { error: dbError } = await supabase
          .from("task_files")
          .insert({
            task_id: taskId,
            file_name: file.name,
            file_path: filePath,
            content_type: file.type
          });

        if (dbError) {
          console.error('Database insert error:', dbError);
          throw dbError;
        }

        console.log('Database record created successfully');
        return { filePath, fileName: file.name };
      } catch (error) {
        console.error('Upload process error:', error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file);
    e.target.value = ''; // Reset input after upload
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
        className="cursor-pointer"
      />
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}