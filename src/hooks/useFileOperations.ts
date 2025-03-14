
import { useFileUpload } from "./file-operations/useFileUpload";
import { useFileView } from "./file-operations/useFileView";
import { useFileDelete } from "./file-operations/useFileDelete";
import { useFileDownload } from "./file-operations/useFileDownload";

export function useFileOperations() {
  const { uploadFile, isLoading: isUploading } = useFileUpload();
  const { viewFile, isLoading: isViewing } = useFileView();
  const { deleteFile, isLoading: isDeleting } = useFileDelete();
  const { downloadFile, isLoading: isDownloading } = useFileDownload();

  return {
    uploadFile,
    viewFile,
    deleteFile,
    downloadFile,
    isLoading: isUploading || isViewing || isDeleting || isDownloading
  };
}
