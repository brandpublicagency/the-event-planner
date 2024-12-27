import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { TaskFileUpload } from "./TaskFileUpload";
import { TaskFileItem } from "./TaskFileItem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TaskFile {
  id: string;
  task_id: string;
  file_name: string;
  file_path: string;
  content_type: string;
}

export function TaskFiles({ taskId }: { taskId: string }) {
  const { data: files = [], isLoading, error, refetch } = useQuery({
    queryKey: ["task-files", taskId],
    queryFn: async () => {
      console.log('Fetching files for task:', taskId);
      
      const { data, error } = await supabase
        .from("task_files")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false })
        .timeout(10000); // 10 second timeout

      if (error) {
        console.error('Error fetching files:', error);
        throw error;
      }

      console.log('Files fetched:', data);
      return data as TaskFile[];
    },
    enabled: !!taskId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    refetchOnWindowFocus: false
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load files. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

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