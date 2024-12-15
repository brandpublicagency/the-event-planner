import { Eye, Download, Loader2 } from "lucide-react";
import { FileActionButton } from "./FileActionButton";
import { FileDeleteDialog } from "./FileDeleteDialog";
import { useFileDownload } from "./useFileDownload";
import { useFileView } from "./useFileView";

interface FileActionsProps {
  file: {
    id: string;
    task_id: string;
    file_name: string;
    file_path: string;
  };
  onDelete: () => void;
  isDeleting: boolean;
}

export function FileActions({ file, onDelete, isDeleting }: FileActionsProps) {
  const { handleDownload, isLoading: isDownloading } = useFileDownload();
  const { handleView, isLoading: isViewing } = useFileView();

  const isDisabled = isDeleting || isDownloading || isViewing;

  // Wrap the onDelete callback in a Promise
  const handleDelete = async () => {
    onDelete();
    return Promise.resolve();
  };

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
        onDelete={handleDelete}
        disabled={isDisabled}
      />
    </div>
  );
}