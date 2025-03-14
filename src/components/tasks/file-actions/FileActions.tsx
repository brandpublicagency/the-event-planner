
import { Download, Eye, Loader2 } from "lucide-react";
import { FileActionButton } from "./FileActionButton";
import { FileDeleteDialog } from "./FileDeleteDialog";
import { useFileOperations } from "@/hooks/useFileOperations";
import { useState } from "react";

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
  const { viewFile, deleteFile, downloadFile } = useFileOperations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  const handleView = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsViewLoading(true);
      console.log("Viewing file with content type:", file.content_type);
      await viewFile(file.file_path, file.content_type);
    } catch (error) {
      console.error("Error viewing file:", error);
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsDownloadLoading(true);
      await downloadFile(file.file_path, file.file_name, file.content_type);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log("Starting delete operation for file:", file);
      await deleteFile(file.file_path, file.id, file.task_id);
      console.log("Delete operation completed successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isViewLoading || isDownloadLoading || isDeleting;

  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <FileActionButton
        icon={isViewLoading ? Loader2 : Eye}
        onClick={handleView}
        disabled={isLoading}
        className={isViewLoading ? "animate-spin" : ""}
        variant="ghost"
      />
      <FileActionButton
        icon={isDownloadLoading ? Loader2 : Download}
        onClick={handleDownload}
        disabled={isLoading}
        className={isDownloadLoading ? "animate-spin" : ""}
        variant="ghost"
      />
      <FileDeleteDialog
        isDeleting={isDeleting}
        onDelete={handleDelete}
        disabled={isLoading}
      />
    </div>
  );
}
