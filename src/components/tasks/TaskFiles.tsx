import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface TaskFilesProps {
  taskId: string;
}

export function TaskFiles({ taskId }: TaskFilesProps) {
  const { data: files, isLoading, error } = useQuery({
    queryKey: ["task-files", taskId],
    queryFn: async () => {
      console.log("Fetching files for task:", taskId);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from("task_files")
        .select()
        .eq("task_id", taskId);

      if (error) {
        console.error("Error fetching task files:", error);
        throw error;
      }

      return data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4">
        Error loading files: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Task Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id} className="mb-2">
            <a href={file.file_path} className="text-blue-600 hover:underline">
              {file.file_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
