import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskFileUploadProps {
  taskId: string;
  onSuccess?: () => void;
}

export function TaskFileUpload({ taskId, onSuccess }: TaskFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      try {
        // First verify task exists and user has access
        const { data: task, error: taskError } = await supabase
          .from('tasks')
          .select('id, user_id')
          .eq('id', taskId)
          .single();

        if (taskError || !task) {
          console.error('Task verification error:', taskError);
          throw new Error('Failed to verify task ownership');
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        if (task.user_id !== user.id) {
          throw new Error('You do not have permission to upload files to this task');
        }

        // Generate a clean filename
        const timestamp = new Date().getTime();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${timestamp}-${cleanFileName}`;

        console.log('Starting file upload:', {
          taskId,
          fileName: cleanFileName,
          filePath,
          contentType: file.type
        });

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from("task-files")
          .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600'
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error('Failed to upload file');
        }

        console.log('File uploaded successfully to storage');

        // Create database record
        const { error: dbError } = await supabase.from("task_files").insert([
          {
            task_id: taskId,
            file_name: cleanFileName,
            file_path: filePath,
            content_type: file.type,
          },
        ]);

        if (dbError) {
          console.error('Database insert error:', dbError);
          // If database insert fails, clean up the uploaded file
          await supabase.storage
            .from("task-files")
            .remove([filePath]);
          throw new Error('Failed to create file record');
        }

        console.log('File record created in database');
        return { success: true };
      } catch (error: any) {
        // Clean up any uploaded file if there was an error
        console.error('Upload error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
  };

  return (
    <div>
      <Input
        type="file"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          variant="outline"
          className="w-full"
          disabled={isUploading}
          asChild
        >
          <span>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </span>
        </Button>
      </label>
    </div>
  );
}