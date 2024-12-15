import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { TaskFileUpload } from "./TaskFileUpload";
import { TaskFileItem } from "./TaskFileItem";
import { checkFileExists } from "@/utils/fileOperations";

interface TaskFile {
  id: string;
  task_id: string;
  file_name: string;
  file_path: string;
  content_type: string;
}

export function TaskFiles({ taskId }: { taskId: string }) {
  const { data: files = [], isLoading, refetch } = useQuery({
    queryKey: ["task-files", taskId],
    queryFn: async () => {
      console.log('Fetching files for task:', taskId);
      
      const { data, error } = await supabase
        .from("task_files")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching files:', error);
        throw error;
      }

      console.log('Files fetched:', data);

      // Filter out files that don't exist in storage
      const validFiles = await Promise.all(
        (data as TaskFile[]).map(async (file) => {
          const { exists } = await checkFileExists(file.file_path);
          return exists ? file : null;
        })
      );

      return validFiles.filter((file): file is TaskFile => file !== null);
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TaskFileUpload taskId={taskId} onSuccess={refetch} />
      <div className="space-y-2">
        {files.map((file) => (
          <TaskFileItem key={file.id} file={file} onDelete={refetch} />
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