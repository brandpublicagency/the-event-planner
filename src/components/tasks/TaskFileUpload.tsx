import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskFileUploadProps {
  taskId: string;
}

export function TaskFileUpload({ taskId }: TaskFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Generate a clean filename
      const fileExt = file.name.split('.').pop();
      const timestamp = new Date().getTime();
      const cleanFileName = `${timestamp}.${fileExt}`;
      const filePath = cleanFileName; // Simplified path structure

      console.log('Starting file upload:', {
        taskId,
        fileName: file.name,
        filePath,
        contentType: file.type
      });

      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("task-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Create database record
      const { error: dbError } = await supabase.from("task_files").insert([
        {
          task_id: taskId,
          file_name: file.name,
          file_path: filePath,
          content_type: file.type,
        },
      ]);

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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