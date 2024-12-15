import { Eye, Download } from "lucide-react";
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
  };
}

export function FileActions({ file }: FileActionsProps) {
  const { handleDownload, isLoading: isDownloading } = useFileDownload();
  const { handleView, isLoading: isViewing } = useFileView();
  const { handleDelete, isDeleting } = useFileDelete();

  const isDisabled = isDeleting || isDownloading || isViewing;

  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <FileActionButton
        icon={Eye}
        onClick={() => handleView(file.file_path)}
        disabled={isDisabled}
      />
      <FileActionButton
        icon={Download}
        onClick={() => handleDownload(file.file_path, file.file_name)}
        disabled={isDisabled}
      />
      <FileDeleteDialog
        isDeleting={isDeleting}
        onDelete={() => handleDelete(file)}
        disabled={isDisabled}
      />
    </div>
  );
}