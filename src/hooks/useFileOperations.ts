
import { useFileUpload } from "./file-operations/useFileUpload";
import { useFileView } from "./file-operations/useFileView";
import { useFileDelete } from "./file-operations/useFileDelete";

export function useFileOperations() {
  const { uploadFile, isLoading: isUploading } = useFileUpload();
  const { viewFile, isLoading: isViewing } = useFileView();
  const { deleteFile, isLoading: isDeleting } = useFileDelete();

  return {
    uploadFile,
    viewFile,
    deleteFile,
    isLoading: isUploading || isViewing || isDeleting
  };
}
