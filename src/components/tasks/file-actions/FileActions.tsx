import { Eye, Download, Loader2 } from "lucide-react";
import { FileActionButton } from "./FileActionButton";
import { FileDeleteDialog } from "./FileDeleteDialog";
import { useFileOperations } from "@/hooks/useFileOperations";

interface FileActionsProps {
  file: {
    id: string;
    task_id: string;
    file_name: string;
    file_path: string;
    content_type: string;
  };
}

export function FileActions({ file }: FileActionsProps) {
  const { downloadFile, viewFile, deleteFile, isLoading } = useFileOperations();

  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <FileActionButton
        icon={isLoading ? Loader2 : Eye}
        onClick={() => viewFile(file.file_path)}
        disabled={isLoading}
        className={isLoading ? "animate-spin" : ""}
        variant="ghost"
      />
      <FileActionButton
        icon={isLoading ? Loader2 : Download}
        onClick={() => downloadFile(file.file_path, file.file_name)}
        disabled={isLoading}
        className={isLoading ? "animate-spin" : ""}
        variant="ghost"
      />
      <FileDeleteDialog
        isDeleting={isLoading}
        onDelete={() => deleteFile(file.file_path, file.id, file.task_id)}
        disabled={isLoading}
      />
    </div>
  );
}