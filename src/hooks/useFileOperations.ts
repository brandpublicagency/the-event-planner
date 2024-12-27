import { useFileUpload } from "./file-operations/useFileUpload";
import { useFileView } from "./file-operations/useFileView";
import { useFileDownload } from "./file-operations/useFileDownload";
import { useFileDelete } from "./file-operations/useFileDelete";

export function useFileOperations() {
  const { uploadFile, isLoading: isUploading } = useFileUpload();
  const { viewFile, isLoading: isViewing } = useFileView();
  const { downloadFile, isLoading: isDownloading } = useFileDownload();
  const { deleteFile, isLoading: isDeleting } = useFileDelete();

  return {
    uploadFile,
    downloadFile,
    viewFile,
    deleteFile,
    isLoading: isUploading || isViewing || isDownloading || isDeleting
  };
}