import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileIcon, Loader2, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface TaskFile {
  id: string;
  file_name: string;
  file_path: string;
  content_type: string;
  created_at: string;
}

export function TaskFiles({ taskId }: { taskId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["task-files", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_files")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TaskFile[];
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const file = files.find(f => f.id === fileId);
      if (!file) return;

      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([file.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", fileId);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      toast({
        title: "File deleted",
        description: "The file has been removed successfully.",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${taskId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("task-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("task_files").insert([
        {
          task_id: taskId,
          file_name: file.name,
          file_path: filePath,
          content_type: file.type,
        },
      ]);

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2 rounded-lg border"
          >
            <div className="flex items-center gap-2">
              <FileIcon className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{file.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(file.created_at), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteFileMutation.mutate(file.id)}
              disabled={deleteFileMutation.isPending}
            >
              {deleteFileMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
        {files.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            No files uploaded yet
          </p>
        )}
      </div>
    </div>
  );
}