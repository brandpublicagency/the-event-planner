
import { Eye, Download, Loader2 } from "lucide-react";
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
  const { downloadFile, viewFile, deleteFile } = useFileOperations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleView = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoading(true);
      await viewFile(file.file_path);
    } catch (error) {
      console.error("Error viewing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoading(true);
      await downloadFile(file.file_path, file.file_name);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <FileActionButton
        icon={isLoading ? Loader2 : Eye}
        onClick={handleView}
        disabled={isLoading || isDeleting}
        className={isLoading ? "animate-spin" : ""}
        variant="ghost"
      />
      <FileActionButton
        icon={isLoading ? Loader2 : Download}
        onClick={handleDownload}
        disabled={isLoading || isDeleting}
        className={isLoading ? "animate-spin" : ""}
        variant="ghost"
      />
      <FileDeleteDialog
        isDeleting={isDeleting}
        onDelete={handleDelete}
        disabled={isLoading || isDeleting}
      />
    </div>
  );
}
