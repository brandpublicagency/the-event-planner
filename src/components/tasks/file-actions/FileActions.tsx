import { Eye, Download, Loader2 } from "lucide-react";
import { FileActionButton } from "./FileActionButton";
import { FileDeleteDialog } from "./FileDeleteDialog";
import { useFileDownload } from "./useFileDownload";
import { useFileView } from "./useFileView";
import { useFileDelete } from "./useFileDelete";

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
  const { handleDownload, isLoading: isDownloading } = useFileDownload();
  const { handleView, isLoading: isViewing } = useFileView();
  const { handleDelete, isDeleting } = useFileDelete();

  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <FileActionButton
        icon={isViewing ? Loader2 : Eye}
        onClick={() => handleView(file.file_path)}
        disabled={isViewing || isDownloading || isDeleting}
        className={isViewing ? "animate-spin" : ""}
        variant="ghost"
      />
      <FileActionButton
        icon={isDownloading ? Loader2 : Download}
        onClick={() => handleDownload(file.file_path, file.file_name)}
        disabled={isViewing || isDownloading || isDeleting}
        className={isDownloading ? "animate-spin" : ""}
        variant="ghost"
      />
      <FileDeleteDialog
        isDeleting={isDeleting}
        onDelete={() => handleDelete(file)}
        disabled={isViewing || isDownloading || isDeleting}
      />
    </div>
  );
}